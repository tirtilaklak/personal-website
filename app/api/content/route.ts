import {authorizeAdmin} from '../../../lib/firebase-auth';
import {getDb} from '../../../db';
import {siteContent} from '../../../db/schema';
import {initialContent,upgradeContent} from '../../content';
import {and,eq} from 'drizzle-orm';
import {z} from 'zod';
const txt=z.string().max(20000);
const httpsUrl=z.string().max(2000).refine(x=>{try{const u=new URL(x);return u.protocol==='https:'&&!!u.hostname}catch{return false}},'Use a valid HTTPS URL');
const url=z.union([z.literal(''),httpsUrl]);
const postSchema=z.object({
  id:z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/),
  title:z.string().max(200),
  slug:z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(x=>{const d=new Date(x+'T00:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===x},'Use a real date'),
  excerpt:z.string().max(1000),body:z.string().max(100000),status:z.enum(['draft','published','archived'])
}).superRefine((post,ctx)=>{if(post.status==='published'&&(!post.title.trim()||!post.body.trim()))ctx.addIssue({code:'custom',message:'Published posts need a title and body'});});
export const contentSchema=z.object({revision:z.literal(6).default(6),panelTitle:txt.optional(),panelText:txt.optional(),panelDetail:txt.optional(),serviceTitle:txt.optional(),serviceText:txt.optional(),noteTitle:txt.optional(),noteText:txt.optional(),contactText:txt.optional(),name:z.string().min(1).max(100),tagline:txt,email:z.union([z.literal(''),z.string().email()]),photo:z.string().max(1400000).refine(x=>x===''||x==='/musa-portrait.png'||/^data:image\/(jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(x)),bio:txt,interests:txt,background:txt,announcement:txt,projects:z.array(z.object({title:z.string().min(1).max(200),description:txt,url})).max(30),news:txt,writing:txt,links:z.array(z.object({label:z.string().min(1).max(80),url:httpsUrl})).max(20),posts:z.array(postSchema).max(100).optional().default([])}).superRefine((content,ctx)=>{
  if(new Set(content.posts.map(p=>p.id)).size!==content.posts.length)ctx.addIssue({code:'custom',message:'Post IDs must be unique',path:['posts']});
  if(new Set(content.posts.map(p=>p.slug)).size!==content.posts.length)ctx.addIssue({code:'custom',message:'Post slugs must be unique',path:['posts']});
});
const headers={'Cache-Control':'private, no-store','Vary':'Authorization'};
const reply=(body:unknown,status=200,version?:string)=>Response.json(body,{status,headers:{...headers,...(version?{ETag:JSON.stringify(version)}:{})}});
export async function GET(request:Request){
  if(!await authorizeAdmin(request))return reply({error:'Only the verified site owner can read editor content.'},403);
  try{const rows=await getDb().select().from(siteContent).where(eq(siteContent.id,'home')).limit(1);const row=rows[0];const content=row?upgradeContent(JSON.parse(row.body)):initialContent;const updatedAt=row?.updatedAt||'initial';return reply({content:{...content,posts:content.posts||[]},updatedAt},200,updatedAt);}catch{return reply({error:'Could not load saved content. Please try again.'},503);}
}
export async function PUT(request:Request){
  const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return reply({error:'Invalid origin'},403);
  if(!await authorizeAdmin(request))return reply({error:'Only the verified site owner can edit this page.'},403);
  const match=request.headers.get('if-match');if(!match)return reply({error:'Reload the editor before saving. Your draft has not been saved.'},428);
  const expected=match.startsWith('"')&&match.endsWith('"')?match.slice(1,-1):match;
  if(expected.length>100||expected==='*')return reply({error:'Invalid content version.'},400);
  if(Number(request.headers.get('content-length'))>1800000)return reply({error:'Content is too large'},413);
  try{
    // Bound streamed input too: Content-Length is not guaranteed to be present.
    const reader=request.body?.getReader();if(!reader)return reply({error:'Missing content'},400);
    const chunks:Uint8Array[]=[];let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>1800000){await reader.cancel();return reply({error:'Content is too large'},413);}chunks.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    const data=contentSchema.parse(JSON.parse(new TextDecoder().decode(bytes)));
    const previous=expected==='initial'?0:Date.parse(expected);if(!Number.isFinite(previous))return reply({error:'Invalid content version.'},400);
    const updatedAt=new Date(Math.max(Date.now(),previous+1)).toISOString();
    const db=getDb();
    const rows=expected==='initial'?
      await db.insert(siteContent).values({id:'home',body:JSON.stringify(data),updatedAt}).onConflictDoNothing().returning({id:siteContent.id}):
      await db.update(siteContent).set({body:JSON.stringify(data),updatedAt}).where(and(eq(siteContent.id,'home'),eq(siteContent.updatedAt,expected))).returning({id:siteContent.id});
    if(!rows.length)return reply({error:'The site changed in another tab. Your draft is still here. Reload the editor before trying again.'},409);
    return reply({ok:true,updatedAt},200,updatedAt);
  }catch(e){return reply({error:e instanceof z.ZodError?e.issues[0]?.message||'Please check your fields.':e instanceof SyntaxError?'Invalid content JSON.':'Could not save. Your draft has not been discarded.'},e instanceof z.ZodError||e instanceof SyntaxError?400:503);}
}
