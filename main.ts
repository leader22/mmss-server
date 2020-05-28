import * as fastify from "fastify";
import * as bearer from "fastify-bearer-auth";
import { load } from "./src/config";
import { generateAuthKeys, validateAuthKey } from "./src/auth";

(() => {
  const [, , configPath] = process.argv;
  const config = load(__dirname, configPath);

  const authKeys = generateAuthKeys(config.userIds, {
    secret: config.tokenSecret,
    ttl: config.tokenTtl,
  });
  console.log(authKeys);

  const server = fastify();
  server.register(bearer, {
    auth(token) {
      return authKeys.some((key) => validateAuthKey(key, token));
    },
  });

  server.get("/check", async () => {
    return { ok: 1 };
  });

  server.listen(config.serverPort);
})();
