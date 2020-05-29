import { readMediaFileStream } from "../../src/media";

describe("readMediaFileStream()", () => {
  it("should resolve readable stream", async () => {
    const readable = await readMediaFileStream(
      __dirname,
      "../music/music.json"
    );

    expect(typeof readable.pipe === "function").toBeTruthy();
  });

  it("should reject if file does not exists", async () => {
    try {
      await readMediaFileStream(__dirname, "../music/undef.mp3");
      fail("should throw");
    } catch {
      // ok
    }
  });
});
