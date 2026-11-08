import assert from 'node:assert/strict';
import {readFile,writeFile,rm,mkdtemp} from 'node:fs/promises';
import ts from 'typescript';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {importPKCS8,SignJWT} from 'jose';
const configPath=new URL('../lib/.firebase-config-test.mjs',import.meta.url);
const authPath=new URL('../lib/.firebase-auth-test.mjs',import.meta.url);
try{
 const compile=s=>ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
 await writeFile(configPath,compile(await readFile(new URL('../lib/firebase-config.ts',import.meta.url),'utf8')));
 await writeFile(authPath,compile((await readFile(new URL('../lib/firebase-auth.ts',import.meta.url),'utf8')).replace("'./firebase-config'","'./.firebase-config-test.mjs'")));
 const {authorizeAdmin}=await import(authPath.href);
 let requests=0;globalThis.fetch=async()=>{requests++;throw new Error('No network expected for invalid tokens')};
 const req=headers=>new Request('https://example.test/api/content',{method:'PUT',headers});
 assert.equal(await authorizeAdmin(req({})),false,'anonymous must fail');
 assert.equal(await authorizeAdmin(req({'oai-authenticated-user-id':'test','oai-authenticated-user-email':'legacy-user@example.test'})),false,'ChatGPT headers must not authorize');
 assert.equal(await authorizeAdmin(req({Authorization:'Bearer invalid'})),false,'malformed token must fail');
 const enc=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
 const unsigned=`${enc({alg:'none'})}.${enc({sub:'kRhshT0wCYU4qp89JCLP3VrfG1F2',email:'musaeminozdem@gmail.com',email_verified:true})}.`;
 assert.equal(await authorizeAdmin(req({Authorization:'Bearer '+unsigned})),false,'unsigned owner claims must fail');
 assert.equal(await authorizeAdmin(req({Authorization:'Bearer '+'a'.repeat(20001)})),false,'oversized tokens must fail');
 assert.equal(requests,0);
 console.log('PASS: anonymous, old identity, malformed, unsigned, oversized tokens rejected without network.');
 const dir=await mkdtemp(join(tmpdir(),'admin-auth-unit-'));
 try{
   execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-keyout',join(dir,'key.pem'),'-out',join(dir,'cert.pem'),'-days','1','-nodes','-subj','/CN=Local-test-only'],{stdio:'ignore'});
   const key=await importPKCS8(await readFile(join(dir,'key.pem'),'utf8'),'RS256');
   const cert=await readFile(join(dir,'cert.pem'),'utf8');
   const now=Math.floor(Date.now()/1000);
   let lookup={localId:'kRhshT0wCYU4qp89JCLP3VrfG1F2',email:'musaeminozdem@gmail.com',emailVerified:true,disabled:false,validSince:String(now-100)};
   globalThis.fetch=async url=>String(url).includes('/metadata/x509/')?Response.json({'unit-key':cert},{headers:{'cache-control':'max-age=300'}}):Response.json({users:[lookup]});
   const token=async patch=>new SignJWT({email:'musaeminozdem@gmail.com',email_verified:true,auth_time:now-10,...patch}).setProtectedHeader({alg:'RS256',kid:'unit-key'}).setSubject('kRhshT0wCYU4qp89JCLP3VrfG1F2').setIssuer('https://securetoken.google.com/musaeminozdem-admin').setAudience('musaeminozdem-admin').setIssuedAt(now).setExpirationTime(now+300).sign(key);
   const good=await token({});
   assert.equal(await authorizeAdmin(req({Authorization:'Bearer '+good})),true,'valid verified owner allowed');
   assert.equal(await authorizeAdmin(req({Authorization:'Bearer '+await token({email:'other@example.test'})})),false,'other email rejected');
   assert.equal(await authorizeAdmin(req({Authorization:'Bearer '+await token({email_verified:false})})),false,'unverified rejected');
   lookup={...lookup,disabled:true};assert.equal(await authorizeAdmin(req({Authorization:'Bearer '+good})),false,'disabled rejected');
   lookup={...lookup,disabled:false,validSince:String(now)};assert.equal(await authorizeAdmin(req({Authorization:'Bearer '+good})),false,'revoked session rejected');
   console.log('PASS: signed owner accepted; mismatched email, unverified, disabled and revoked sessions rejected using mocked provider.');
 }finally{await rm(dir,{recursive:true,force:true})}
}finally{await rm(configPath,{force:true});await rm(authPath,{force:true});}
