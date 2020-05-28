import fetch from "node-fetch";

describe("", () => {
  it("should not", async () => {
    const res = await fetch("http://localhost:8080/check");
    expect(res.ok).toBeFalsy();
  });
});
