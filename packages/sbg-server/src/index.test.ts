import SBGServer from './server';

const server = new SBGServer();
const app = server.get();

app.get('/', function (_, res) {
  const data = {
    message: 'Hello world!',
    layout: 'layout.njk',
    title: 'Nunjucks example'
  };

  res.render('index.njk', data);
});

server.start();
