import {importX509, jwtVerify} from 'jose';
import {firebaseConfig, ADMIN_EMAIL, ADMIN_UID} from './firebase-config';
let certificates: {expires:number; keys:Record<string,string>} | undefined;
async function signingKey(kid:string){
  if(!certificates || certificates.expires < Date.now()){
    const response=await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    if(!response.ok) throw new Error('Identity provider unavailable');
    const keys=await response.json() as Record<string,string>;
    const maxAge=Number(response.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1]||300);
    certificates={keys,expires:Date.now()+Math.min(maxAge,3600)*1000};
  }
  const pem=certificates.keys[kid];
  if(!pem)throw new Error('Unknown signing key');
  return importX509(pem,'RS256');
}
export async function authorizeAdmin(request:Request):Promise<boolean>{
  try{
    const authorization=request.headers.get('authorization');
    if(!authorization?.startsWith('Bearer '))return false;
    const token=authorization.slice(7);
    if(token.length>20000)return false;
    const {payload}=await jwtVerify(token,async header=>{
      if(header.alg!=='RS256'||!header.kid)throw new Error('Invalid token');
      return signingKey(header.kid);
    },{algorithms:['RS256'],issuer:`https://securetoken.google.com/${firebaseConfig.projectId}`,audience:firebaseConfig.projectId});
    const now=Math.floor(Date.now()/1000);
    if(payload.sub!==ADMIN_UID||payload.email!==ADMIN_EMAIL||payload.email_verified!==true||typeof payload.auth_time!=='number'||payload.auth_time>now||typeof payload.iat!=='number'||payload.iat>now||typeof payload.exp!=='number')return false;
    // Lookup rejects disabled/deleted accounts and lets us reject sessions invalidated by a password reset.
    const result=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:token})});
    if(!result.ok)return false;
    const data=await result.json() as {users?:Array<{localId:string;email:string;emailVerified?:boolean;disabled?:boolean;validSince?:string}>};
    const user=data.users?.[0];
    return !!user&&user.localId===ADMIN_UID&&user.email===ADMIN_EMAIL&&user.emailVerified===true&&!user.disabled&&Number(user.validSince||0)<=payload.auth_time;
  }catch{return false;}
}
