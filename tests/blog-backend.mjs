import assert from 'node:assert/strict';
import {readFile,writeFile,rm} from 'node:fs/promises';
import ts from 'typescript';
const root=new URL('../',import.meta.url);
const routeFile=new URL('../.blog-route-test.mjs',import.meta.url);
const contentFile=new URL('../.blog-content-test.mjs',import.meta.url);
const compile=s=>ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
let row;let authorized=true;
const matches=(record,condition)=>condition.kind==='and'?condition.items.every(c=>matches(record,c)):record[condition.key]===condition.value;
globalThis.__blogTest={authorized:()=>authorized,db:()=>({
 select:()=>({from:()=>({where:()=>({limit:async()=>row?[row]:[]})})}),
 insert:()=>({values:value=>({onConflictDoNothing:()=>({returning:async()=>{if(row)return [];row={...value};return [{id:row.id}]}})})}),
 update:()=>({set:values=>({where:condition=>({returning:async()=>{if(!row||!matches(row,condition))return [];row={...row,...values};return [{id:row.id}]}})})})
})};
try{
 await writeFile(contentFile,compile(await readFile(new URL('app/content.ts',root),'utf8')));
 let source=await readFile(new URL('app/api/content/route.ts',root),'utf8');
 source=source.replace("import {authorizeAdmin} from '../../../lib/firebase-auth';","const authorizeAdmin=async()=>globalThis.__blogTest.authorized();");
 source=source.replace("import {getDb} from '../../../db';","const getDb=()=>globalThis.__blogTest.db();");
 source=source.replace("import {siteContent} from '../../../db/schema';","const siteContent={id:'id',body:'body',updatedAt:'updatedAt'};");
 source=source.replace("from '../../content'","from './.blog-content-test.mjs'");
 source=source.replace("import {and,eq} from 'drizzle-orm';","const eq=(key,value)=>({kind:'eq',key,value});const and=(...items)=>({kind:'and',items});");
 await writeFile(routeFile,compile(source));
 const {GET,PUT,contentSchema}=await import(routeFile.href);
 const {initialContent}=await import(contentFile.href);
 const draft={id:'post-1',title:'',slug:'first-post',date:'2026-11-07',excerpt:'',body:'',status:'draft'};
 const data={...initialContent,posts:[draft]};
 assert(contentSchema.safeParse(data).success,'empty draft accepted');
 assert(!contentSchema.safeParse({...data,posts:[{...draft,status:'published'}]}).success,'blank published rejected');
 assert(!contentSchema.safeParse({...data,posts:[draft,{...draft,id:'post-2'}]}).success,'duplicate slug rejected');
 assert(!contentSchema.safeParse({...data,posts:[draft,{...draft,slug:'second-post'}]}).success,'duplicate ID rejected');
 assert(!contentSchema.safeParse({...data,posts:[{...draft,slug:'../private'}]}).success,'unsafe slug rejected');
 assert(!contentSchema.safeParse({...data,posts:[{...draft,date:'2026-02-30'}]}).success,'invalid date rejected');
 const request=(body,version,extra={})=>new Request('https://example.test/api/content',{method:'PUT',headers:{'Content-Type':'application/json',Origin:'https://example.test',...(version?{'If-Match':JSON.stringify(version)}:{}),...extra},body:JSON.stringify(body)});
 authorized=false;
 assert.equal((await GET(new Request('https://example.test/api/content'))).status,403);
 assert.equal((await PUT(request(data,'initial'))).status,403);
 authorized=true;
 let response=await GET(new Request('https://example.test/api/content'));
 assert.equal(response.headers.get('cache-control'),'private, no-store');assert.equal(response.headers.get('vary'),'Authorization');
 assert.equal((await response.json()).updatedAt,'initial');
 assert.equal((await PUT(request(data))).status,428);
 assert.equal((await PUT(request(data,'initial',{Origin:'https://attacker.test'}))).status,403);
 response=await PUT(request(data,'initial'));assert.equal(response.status,200);
 const first=(await response.json()).updatedAt;
 assert.equal((await PUT(request({...data,bio:'overwrite'},'initial'))).status,409);assert.notEqual(JSON.parse(row.body).bio,'overwrite');
 response=await PUT(request({...data,bio:'new bio'},first));assert.equal(response.status,200);const second=(await response.json()).updatedAt;assert.notEqual(second,first);
 assert.equal((await PUT(request({...data,bio:'stale'},first))).status,409);assert.equal(JSON.parse(row.body).bio,'new bio');
 response=await GET(new Request('https://example.test/api/content'));assert.equal((await response.json()).content.posts[0].status,'draft','authenticated admin gets drafts');
 assert.equal((await PUT(request({...data,bio:'x'.repeat(1800001)},second))).status,413);
 const admin=await readFile(new URL('app/admin/page.tsx',root),'utf8');assert(!admin.includes('getDb'));assert(!admin.includes('content='),'admin SSR must not embed data');
 const home=await readFile(new URL('app/page.tsx',root),'utf8');assert(home.includes("filter(post=>post.status==='published')"),'home filters unpublished posts');
 console.log('PASS: post validation, auth denial, cache privacy, required versions, atomic conflict/no lost writes, body limit, admin SSR and home filtering.');
}finally{await rm(routeFile,{force:true});await rm(contentFile,{force:true});delete globalThis.__blogTest;}
