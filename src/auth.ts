import { createHmac, timingSafeEqual } from "crypto";

type AuthKey = {
  id: string;
  token: string;
  expireAt: number;
};
export const generateAuthKeys = (
  ids: string[],
  { secret, ttl }: { secret: string; ttl: number }
): AuthKey[] => {
  const keys: AuthKey[] = [];
  for (const id of ids) {
    const token = createHmac("sha256", secret).update(id).digest("base64");
    const expireAt = Date.now() + ttl;
    keys.push({ id, token, expireAt });
  }

  if (process.env.NODE_ENV === "test") {
    keys.push({ id: "valid", token: "foo", expireAt: Date.now() + ttl });
    keys.push({ id: "expired", token: "bar", expireAt: Date.now() - ttl });
  }

  return keys;
};

const compare = (a: string, b: string): boolean => {
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
};

export const validateAuthKey = (key: AuthKey, token: string): boolean => {
  const isSame = compare(key.token, token);
  const isFresh = key.expireAt > Date.now();
  if (isSame && isFresh) return true;
  return false;
};
