import { normalize, join } from "path";
import { createReadStream, promises } from "fs";

export const readMediaFileStream = async (
  baseDir: string,
  path: string
): Promise<NodeJS.ReadableStream> => {
  const mpath = normalize(join(baseDir, path));
  await promises.stat(mpath);

  return createReadStream(mpath);
};
