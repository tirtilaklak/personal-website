import Admin from './panel';
export const dynamic='force-dynamic';
export const metadata={title:'Admin | Musa Emin Ozdem',robots:{index:false,follow:false}};
// Never embed draft posts in unauthenticated HTML or the React server payload.
export default function AdminPage(){return <Admin/>;}
