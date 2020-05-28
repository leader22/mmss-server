import fastify from "fastify";
import bearer from "fastify-bearer-auth";
import helmet from "fastify-helmet";
import { load, validate } from "./src/config";
import { generateAuthKeys, validateAuthKey } from "./src/auth";
import { readMediaFileStream } from "./src/media";

(() => {
  const [, , configPath] = process.argv;
  const config = validate(load(__dirname, configPath));

  const authKeys = generateAuthKeys(config.userIds, {
    secret: config.tokenSecret,
    ttl: config.tokenTtl,
  });
  console.log(authKeys);

  const server = fastify();
  server.register(helmet);
  server.register(bearer, {
    keys: new Set([]),
    auth: (token: string) =>
      authKeys.some((key) => validateAuthKey(key, token)),
  });

  server.get("/check", async () => {
    return {};
  });

  server.get<{ Querystring: { path: string } }>(
    "/track",
    async (request, reply) => {
      const path = request.query.path;
      if (typeof path !== "string")
        throw {
          statusCode: 400,
          message: "The query params: path is required!",
        };

      const readable = await readMediaFileStream(
        config.musicDirectory,
        path
      ).catch((err) => {
        console.log(path);
        throw { statusCode: 400, message: err.message };
      });

      reply.type("audio/mpeg");
      return readable;
    }
  );

  server.listen(config.serverPort);
})();
