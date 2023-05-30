import { google } from 'googleapis';
import { jwtAuthenticate, scopes } from '../src/oauth2';

jwtAuthenticate(scopes).then((client) => {
  // retrieve user profile
  const people = google.people({ auth: client, version: 'v1' });
  people.people
    .get({
      resourceName: 'people/me',
      personFields: 'emailAddresses'
    })
    .then((res) => {
      console.log(res.data);
    });
});
