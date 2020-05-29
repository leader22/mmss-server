import { join, normalize, isAbsolute } from "path";
import { statSync } from "fs";

type Config = {
  serverPort: number;
  tokenSecret: string;
  tokenTtl: number;
  userIds: string[];
  musicDirectory: string;
};

export const load = (baseDir: string, path: string): Config => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(normalize(join(baseDir, path))) as Config;
};

export const validate = (config: Config): Config => {
  if (!isAbsolute(config.musicDirectory))
    throw new Error("config.musicDirectory must be an absolute path!");
  if (!statSync(config.musicDirectory).isDirectory())
    throw new Error("config.musicDirectory does not exists!");

  return config;
};
