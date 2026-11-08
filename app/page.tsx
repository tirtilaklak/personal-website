import Site from './site';
import { getDb } from '../db';
import {siteContent} from '../db/schema';
import { initialContent, upgradeContent, type Content } from './content';

export const dynamic='force-dynamic';
export default async function Home(){let content:Content=initialContent;let loadError=false;try{const rows=await getDb().select().from(siteContent).limit(1);if(rows[0])content=upgradeContent(JSON.parse(rows[0].body));}catch{loadError=true;} content={...content,posts:(content.posts||[]).filter(post=>post.status==='published')}; return <Site initial={content} loadError={loadError} canEdit={false}/>}
