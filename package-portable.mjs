import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
import {resolve,relative,dirname,join} from 'node:path';
const root=resolve('dist'),out=resolve('outputs/website');
async function walk(dir){for(const item of await readdir(dir,{withFileTypes:true})){const source=join(dir,item.name);if(item.isDirectory()){await walk(source);continue;}const dest=join(out,relative(root,source));await mkdir(dirname(dest),{recursive:true});if(item.name.endsWith('.html')){let html=await readFile(source,'utf8');html=html.replace(/(href|src)="(\/[^\"]*)"/g,(_,attr,url)=>{const [pathname,hash]=url.split('#');const target=join(root,pathname.endsWith('/')?pathname+'index.html':pathname);let link=relative(dirname(source),target).replaceAll('\\','/');return `${attr}="${link}${hash?'#'+hash:''}"`;});await writeFile(dest,html);}else await copyFile(source,dest);}}
await walk(root);
console.log('Portable website generated. Open outputs/website/index.html directly.');
