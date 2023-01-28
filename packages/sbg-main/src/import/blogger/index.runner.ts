import hbx from 'hexo-blogger-xml';
import path from 'upath';

const xmlFile = path.join(process.cwd(), 'import/araka_id.xml');

const c = new hbx(xmlFile);
