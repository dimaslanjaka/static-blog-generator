import { google } from 'googleapis';
import { jwtAuthorize, scopes } from '../src/oauth2';

jwtAuthorize(scopes).then((client) => {
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
