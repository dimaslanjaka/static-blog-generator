import { notify2 } from './notify';
import { jwtAuthorize } from './oauth2';

jwtAuthorize().then((client) => {
  notify2('https://www.webmanajemen.com/chimeraland/monsters/cicada.html', 'URL_UPDATED', client.credentials);
});
