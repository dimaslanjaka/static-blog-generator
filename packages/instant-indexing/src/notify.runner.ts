import { notify2 } from './notify';
import { jwtAuthenticate } from './oauth2';

jwtAuthenticate().then((client) => {
  notify2('https://www.webmanajemen.com/chimeraland/monsters/cicada.html', 'URL_UPDATED', client.credentials);
});
