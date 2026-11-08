import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Musa Emin Ozdem',description:'AI systems, research, and engineering. Selected work and writing by Musa Emin Ozdem.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
