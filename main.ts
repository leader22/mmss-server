import fastify from "fastify";
import cors from "fastify-cors";
import bearer from "fastify-bearer-auth";
import helmet from "fastify-helmet";
import { load, validate } from "./src/config";
import { generateAuthKeys, validateAuthToken } from "./src/auth";
import { readMediaFileStream } from "./src/media";

(() => {
  const env = process.env.NODE_ENV ?? "development";
  const isProduction = env === "production";
  console.log("NODE_ENV:", env);

  const [, , configPath] = process.argv;
  console.log("config:", configPath);

  const config = validate(load(__dirname, configPath));
  console.log(config);

  const authKeys = generateAuthKeys(
    config.userIds,
    {
      secret: config.tokenSecret,
      ttl: config.tokenTtl,
    },
    isProduction
  );
  console.log(authKeys);

  const server = fastify();
  server.register(cors, { origin: isProduction ? false : true });
  server.register(helmet);
  server.register(bearer, {
    // Type defs requires this, but not used because of `auth` function
    keys: new Set([]),
    auth: (token: string) => validateAuthToken(authKeys, token),
  });

  server.get("/index", async (_, reply) => {
    const readable = await readMediaFileStream(
      config.musicDirectory,
      "music.json"
    ).catch((err) => {
      console.error(err);
      throw { statusCode: 400, message: err.message };
    });

    reply.type("application/json");
    return readable;
  });

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
