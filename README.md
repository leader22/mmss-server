# mmss-server

My Mp3 Streaming Server SERVER.

# How to use

```sh
# start
pm2 start index.js -x -- --mpath ~/Music --user xxxxxxxx --pass xxxxxxxx

# log id to stop
pm2 list
# stop
pm2 stop <id>
```

# Errors
```js
// Api returns status code 40x with each error code below
{
  INVALID_PARAMS:         1,
  LOGIN_FAILURE:          2,
  AUTHORIZATION_REQUIRED: 3,
}
```

# Note
- Can't accept `Range` headers.
