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
    // Type defs requires this, but not used because of `auth` function
    keys: new Set([]),
    auth: (token: string) =>
      authKeys.some((key) => validateAuthKey(key, token)),
  });

  // Route to check auth token is still valid or NOT
  server.get("/check", async () => ({}));

  server.get<{ Querystring: { path: string } }>(
    "/track",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            path: { type: "string", pattern: "^.+.mp3$" },
          },
          required: ["path"],
        },
      },
    },
    async (request, reply) => {
      const { path } = request.query;

      const readable = await readMediaFileStream(
        config.musicDirectory,
        path
      ).catch((err) => {
        console.error(err);
        throw { statusCode: 400, message: err.message };
      });

      reply.type("audio/mpeg");
      return readable;
    }
  );

  server.listen(config.serverPort);
})();
