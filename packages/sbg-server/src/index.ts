import cookieParser from 'cookie-parser';
import express from 'express';
import nunjucks from 'nunjucks';
import serveIndex from 'serve-index';
import path from 'upath';

const SITE_ROOT = 'D:/Repositories/static-blog-generator/packages/sbg-main/test';
const POST_ROOT = path.join(SITE_ROOT, 'src-posts');

const app = express();
const _env = nunjucks.configure(path.join(__dirname, 'views'), {
  noCache: true,
  autoescape: true,
  express: app
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.static(path.join(process.cwd(), 'node_modules')));
// Serve URLs like /ftp/thing as public/ftp/thing
// The express.static serves the file contents
// The serveIndex is this module serving the directory
app.use('/post/list', express.static(POST_ROOT), serveIndex(POST_ROOT, { icons: true }));

app.get('/', function (_, res) {
  const data = {
    message: 'Hello world!',
    layout: 'layout.njk',
    title: 'Nunjucks example'
  };

  res.render('index.njk', data);
});

app.listen(4000, function () {
  console.log('http://localhost:4000');
});
