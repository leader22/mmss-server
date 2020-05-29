import { generateAuthKeys, validateAuthToken } from "../../src/auth";

describe("generateAuthKeys()", () => {
  it("should generate same num of keys", async () => {
    const ids = ["a", "b", "c"];
    const keys = await generateAuthKeys(
      ids,
      { secret: "secret", ttl: 100 },
      true
    );
    expect(keys).toHaveLength(ids.length);
  });

  it("should generate test keys for test", async () => {
    const ids = ["a", "b", "c"];
    const keys = await generateAuthKeys(
      ids,
      { secret: "secret", ttl: 100 },
      false
    );
    expect(keys.length > ids.length).toBeTruthy();
  });

  it("should apply ttl", async () => {
    const [key1] = await generateAuthKeys(
      ["a"],
      { secret: "secret", ttl: 100 },
      false
    );
    expect(key1.expireAt).toBeGreaterThan(Date.now());
  });

  it("should generate different key by secret for same id", async () => {
    const [key1] = await generateAuthKeys(
      ["a"],
      { secret: "key1", ttl: 100 },
      false
    );
    const [key2] = await generateAuthKeys(
      ["a"],
      { secret: "key2", ttl: 100 },
      false
    );
    expect(key1.token).not.toBe(key2.token);
  });
});

describe("validateAuthToken()", () => {
  it("should return true for valid token", async () => {
    const keys = await generateAuthKeys(
      [],
      { secret: "secret", ttl: 100000 },
      false
    );
    const res = validateAuthToken(keys, keys[0].token);
    expect(res).toBeTruthy();
  });

  it("should return false for invalid token", async () => {
    const keys = await generateAuthKeys(
      [],
      { secret: "secret", ttl: 100000 },
      false
    );
    const res = validateAuthToken(keys, keys[1].token);
    expect(res).toBeFalsy();
  });
});
