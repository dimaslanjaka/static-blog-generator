# Instant Indexing

Instant indexing using google API

## env variable needed
```properties
GAPI=xxxGOOGLE API KEY V3xxx
GCLIENT=x-xxx.apps.googleusercontent.com
GSECRET=xxx-xxxx-xxx
GCALLBACK=http://localhost:4000/auth
GSERVICEKEY=xxxGOOGLE SERVICE KEYxxx
GSERVICEMAIL=main-xxx@xxx-xxx.iam.gserviceaccount.com
GSERVICEID=xxxGOOGLE SERVICE IDxxx
GCLIENTPEM=base64 encoded JSON google client
GSERVICEPEM=base64 encoded JSON google service IAM admin
```

## Basic Usage
```typescript
import { google } from 'googleapis';
import { jwtAuthenticate } from 'instant-indexing';

jwtAuthenticate(['profile']).then((client) => {
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
```

## To index article
```typescript
import { notify2, jwtAuthenticate } from 'instant-indexing';

jwtAuthenticate().then((client) => {
  notify2('https://www.webmanajemen.com/chimeraland/monsters/cicada.html', 'URL_UPDATED', client.credentials);
});
```