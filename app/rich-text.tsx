import {Fragment,type ReactNode} from 'react';
export function safeLink(value:string){try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password&&!!url.hostname?url.href:null}catch{return null}}
// Deliberately small markup subset. Never evaluate HTML, CSS, or arbitrary URL schemes.
export function richText(text:string,depth=0):ReactNode{
 if(depth>12)return text;
 const pattern=/(\*\*\*([^\n]+?)\*\*\*|\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^\n]+?)\*\*|==([^\n]+?)==|__([^\n]+?)__|~~([^\n]+?)~~|\*([^*\n]+?)\*|\n)/g;
 const nodes:ReactNode[]=[];let cursor=0;let m:RegExpExecArray|null;
 while((m=pattern.exec(text))){nodes.push(text.slice(cursor,m.index));const inner=(s:string)=>richText(s,depth+1);let node:ReactNode=m[0];
 if(m[2])node=<strong><em>{inner(m[2])}</em></strong>;else if(m[3]){const href=safeLink(m[4]);if(href)node=<a href={href} target="_blank" rel="noopener noreferrer">{inner(m[3])}</a>}
 else if(m[5])node=<strong>{inner(m[5])}</strong>;else if(m[6])node=<mark>{inner(m[6])}</mark>;else if(m[7])node=<u>{inner(m[7])}</u>;else if(m[8])node=<s>{inner(m[8])}</s>;else if(m[9])node=<em>{inner(m[9])}</em>;else node=<br/>;
 nodes.push(<Fragment key={m.index}>{node}</Fragment>);cursor=pattern.lastIndex;
 }nodes.push(text.slice(cursor));return nodes;
}
