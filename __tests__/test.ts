import fetch from "node-fetch";

const $get = async (path: string, headers = {}) => {
  const res = await fetch(`http://localhost:8080${path}`, {
    headers,
  });
  return res;
};

describe("GET /check", () => {
  it("should return 401 w/o header", async () => {
    const res = await $get("/check");
    expect(res.status).toBe(401);
  });

  it("should return 401 w/ invalid header", async () => {
    const res = await $get("/check", { Authorization: "invalid" });
    expect(res.status).toBe(401);
  });

  it("should return 401 w/ valid header but expired", async () => {
    const res = await $get("/check", { Authorization: "Bearer bar" });
    expect(res.status).toBe(401);
  });

  it("should return 200 w/ valid header", async () => {
    const res = await $get("/check", { Authorization: "Bearer foo" });
    expect(res.status).toBe(200);
  });
});

describe("GET /track", () => {
  it("should return 401 w/o header", async () => {
    const res = await $get("/track");
    expect(res.status).toBe(401);
  });

  it("should return 401 w/ invalid header", async () => {
    const res = await $get("/track", { Authorization: "invalid" });
    expect(res.status).toBe(401);
  });

  it("should return 401 w/ valid header but expired", async () => {
    const res = await $get("/track", { Authorization: "Bearer bar" });
    expect(res.status).toBe(401);
  });

  it("should return 400 w/ valid header but missing params", async () => {
    const res = await $get("/track", { Authorization: "Bearer foo" });
    expect(res.status).toBe(400);
  });

  it("should return 200 w/ valid header and params", async () => {
    const res = await $get("/track?path=sample.mp3", {
      Authorization: "Bearer foo",
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-type")).toBe("audio/mpeg");
  });
});
