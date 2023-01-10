import cookieParser from 'cookie-parser';
import express from 'express';
import nunjucks from 'nunjucks';
import path from 'upath';

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
