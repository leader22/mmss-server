import { join, normalize } from "path";

type Config = {
  serverPort: number;
  tokenSecret: string;
  tokenTtl: number;
  userIds: string[];
  musicDirectory: string;
};

export const load = (...path: string[]): Config => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(normalize(join(...path))) as Config;
};
