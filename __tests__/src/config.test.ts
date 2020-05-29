import { load, validate } from "../../src/config";

describe("load()", () => {
  it("should load", () => {
    const config = load(__dirname, "../config.json");
    expect(config).toHaveProperty("serverPort");
  });
});

describe("validate()", () => {
  it("should not throw", () => {
    const config = load(__dirname, "../config.json");
    expect(() => validate(config)).not.toThrowError();
  });

  it("should throw if musicDirectory is relative path", () => {
    const config = load(__dirname, "../config.json");
    config.musicDirectory = "../";
    expect(() => validate(config)).toThrowError();
  });

  it("should throw if musicDirectory does not exists", () => {
    const config = load(__dirname, "../config.json");
    config.musicDirectory = "/foo/bar";
    expect(() => validate(config)).toThrowError();
  });
});
