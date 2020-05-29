# mmss-server

My Mp3 Streaming Server SERVER.

## Spec
- Work as HTTP/1.1 REST api server
  - returns JSON response and MP3 file
- Load some config on start up from `config.js`
  - base directory for music files
  - server port
  - user ids
  - etc..
- Have basic security functions
  - `helmet`
  - `bearer-auth`

## Routes
### GET `/session`
- Request
  - Required header: `Authorization`
- Response
  - 200:  Success
  - 401: Authorization required

### GET `/track`
- Request
  - Required header: `Authorization`
  - Required params: `path`
- Response
  - 200: Success w/ `audio/mpeg`
  - 400: Invalid, missing params
  - 401: Authorization required

## Test
```sh
NODE_ENV=test npm start -- ./__tests__/config.json
npm t
```

## Production
```sh
npm run build
# put ./lib/config.json
NODE_ENV=production node ./lib/main.js ./config.json
```
