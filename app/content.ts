export type BlogPost={id:string;title:string;slug:string;date:string;excerpt:string;body:string;status:'draft'|'published'|'archived'};
export type Content = {posts?:BlogPost[];revision?:number; panelTitle?:string; panelText?:string; panelDetail?:string; serviceTitle?:string; serviceText?:string; noteTitle?:string; noteText?:string; contactText?:string; name:string; tagline:string; email:string; photo:string; bio:string; interests:string; background:string; announcement:string; projects:{title:string;description:string;url:string}[]; news:string; writing:string; links:{label:string;url:string}[]};
const originalContent:Content={name:'Musa Emin Ozdem',tagline:'AI systems · Research · Engineering',email:'',photo:'',bio:'I work at the intersection of AI, engineering, and product development. My interests include agent reliability, evaluation, and turning research into useful systems.\n\nMy background spans Amazon and Boeing, where I worked on data, software, and AI/ML platforms. I bring an electrical engineering foundation and a STEM MBA from Purdue to the problems I work on.\n\nI am building ScienceToStartup, exploring how exceptional technical work can become practical products and companies.',interests:'AI agents and evaluation\nReliable machine learning systems\nResearch-to-product development',background:'Amazon · Boeing\nB.S. Electrical Engineering\nSTEM MBA, Purdue',announcement:'Currently exploring AI evaluation, agent reliability, and research-to-product development.',projects:[{title:'ScienceToStartup',description:'Exploring the path from technical research to practical products and new companies.',url:'https://sciencetostartup.com'},{title:'AI / ML platforms',description:'Product and platform work spanning data infrastructure, model integration, and trustworthy AI.',url:''},{title:'Cloud infrastructure',description:'Work on automated Kubernetes rightsizing, balancing infrastructure efficiency with reliability.',url:''}],news:'Building at the intersection of AI research, evaluation, and engineering.',writing:'Notes on AI systems, evaluation, and building. Selected writing will appear here.',links:[]};

const previousContent:Content={...originalContent,
 revision:3, photo:'/musa-portrait.png',
 tagline:'AI systems, evaluation, and engineering',
 bio:'I am a product and technology leader working on AI systems. I am interested in how we evaluate AI agents, understand their failures, and make them more reliable.\n\nI previously worked at Amazon and Boeing on data, software, and AI/ML platforms. My undergrad is in electrical engineering, and I have a STEM MBA from Purdue. Before moving into technology, I served in the Turkish Navy.\n\nI am also building [ScienceToStartup](https://sciencetostartup.com), exploring how technical research can become useful products and companies. My current interests include training environments for AI decision-making and practical ways to evaluate agent behavior.',
 interests:'AI agents and evaluation\nReliable ML systems\nResearch and product development',
 announcement:'',
 projects:[
 {title:'ScienceToStartup',description:'I am exploring the path from technical research to products and companies, with a focus on AI.',url:'https://sciencetostartup.com'},
 {title:'AI / ML platforms',description:'At Boeing, I worked on platforms for AI and machine learning, including model integration, explainability, and trust.',url:''},
 {title:'Data and software platforms',description:'At Amazon, I worked on data and software platforms across sustainability, product lifecycle management, and transportation.',url:''}],
 news:'',
 writing:'I haven’t published any posts here yet.'
};
const copyV4:Content={...previousContent,
 revision:4,
 tagline:'AI builder and product engineer',
 bio:'I am an AI builder and product engineer. My projects include SnoLocal, a hyperlocal iOS app for families, and [ScienceToStartup](https://sciencetostartup.com), a tool for evaluating arXiv papers as startup ideas.\n\nPreviously, I worked at Amazon and Boeing. At Amazon, I worked on sustainability data, product lifecycle management, and transportation platforms. At Boeing, I worked on an AI/ML platform, including LLM integration, explainability, and trust. My undergraduate degree is in electrical engineering, and my MBA is from Purdue. Before moving into technology, I served in the Turkish Navy.\n\nI also build with AI coding agents. For SnoLocal, I used SwiftUI and Supabase, with versioned specifications and project context to guide the agents’ work.',
 projects:[],
 writing:'',
 links:[]
};
const copyV5:Content={...copyV4,
 revision:5,
 tagline:'AI systems and engineering',
 panelTitle:'Projects and notes',
 panelText:'I build AI applications and tools for working with them.',
 panelDetail:'SnoLocal · ScienceToStartup · AI evaluation',
 bio:'I am an AI builder and product engineer. My projects include SnoLocal, a hyperlocal iOS planning app for families, and [ScienceToStartup](https://sciencetostartup.com), a platform for evaluating arXiv papers as startup ideas. I work on AI applications, data platforms, and the software around them, drawing on experience at Amazon, Boeing, and Carnival.\n\nMy undergraduate degree is in electrical engineering, and my MBA is from Purdue. At Boeing, I worked on the internal AI/ML platform, including LLM integration, explainability, and trust. At Amazon, I worked on sustainability data, product lifecycle management, and transportation platforms. Before moving into technology, I served in the Turkish Navy.\n\nI also build with AI coding agents. For SnoLocal, I used SwiftUI and Supabase, with versioned specifications and project context to guide the agents’ work. The project brought together application development and a structured way of working with agents: written requirements, feature flags, and reviews before changes went into the product. ScienceToStartup was an earlier solo project; its development process informed how I approached SnoLocal.',
 interests:'SnoLocal (iOS planning app for families)\nScienceToStartup (arXiv paper viability)\nAI-industry dependency tracker (Python)\nAI agents and evaluation',
 background:'Amazon / AWS (software and product)\nBoeing (AI/ML platforms)\nCarnival (AI applications and operations)\nTurkish Navy (navigation and operations)',
 news:'SnoLocal: I built a hyperlocal iOS planning app for families with SwiftUI and Supabase. The project uses versioned specifications, feature flags, and context files for AI coding agents.\nScienceToStartup: I built a platform for evaluating the commercial potential of arXiv papers. You can visit [ScienceToStartup](https://sciencetostartup.com).\nAI-industry dependency tracker: a Python tool that brings together SEC filings and news to study relationships between companies in the AI industry.\nAI/ML platforms: at Boeing, I worked on integrating LLMs into an internal platform and on tools for explainability and trust.\nData pipelines: I worked on simplifying data ingestion for model training.\nData and software platforms: at Amazon, my work covered sustainability, product lifecycle management, and transportation.',
 serviceTitle:'Background',
 serviceText:'Industry: Amazon / AWS, Boeing, and Carnival.\nEducation: B.S. in electrical engineering; MBA, Purdue University.',
 noteTitle:'How I build',
 noteText:'I use written specifications, versioned context, and review steps when working with AI coding agents. For SnoLocal, those practices were part of the development process from the start.',
 contactText:'You can find my professional background on [LinkedIn](https://www.linkedin.com/in/musa-emin-ozdem/).',
 links:[{label:'LinkedIn',url:'https://www.linkedin.com/in/musa-emin-ozdem/'},{label:'ScienceToStartup',url:'https://sciencetostartup.com'}]
};
export const initialContent:Content={...copyV5,revision:6,links:[...copyV5.links,{label:'GitHub',url:'https://github.com/tirtilaklak'}]};
// Apply design defaults only where previous drafts were not owner-edited.
export function upgradeContent(saved:Content):Content {
 if(saved.revision===6)return saved;
 if(saved.revision===5)return {...saved,revision:6,links:[...saved.links.filter(l=>!/github/i.test(l.label)&&!/^https:\/\/github\.com\//i.test(l.url)),{label:'GitHub',url:'https://github.com/tirtilaklak'}]};
 const result={...saved,revision:6};
 for(const key of Object.keys(initialContent) as (keyof Content)[]){
  if(key==='revision')continue;
  if(saved[key]===undefined||[originalContent,previousContent,copyV4].some(b=>JSON.stringify(saved[key])===JSON.stringify(b[key])))
   (result as unknown as Record<string,unknown>)[key]=initialContent[key];
 }
 return result;
}
