const supertest = require("supertest");
const app = require("./app");
const request = supertest(app);

describe("GET /sodas ", () => {
  test("responds with the array of sodas", async () => {
    const response = await request.get("/sodas");
    const data = JSON.parse(response.text);
    expect(data.code).toEqual(200);
    if (data.data.length > 0) {
        expect(data.data[0]).toHaveProperty("productName");
        expect(data.data[0]).toHaveProperty("description");
        expect(data.data[0]).toHaveProperty("cost");
        expect(data.data[0]).toHaveProperty("max");
        expect(data.data[0]).toHaveProperty("remaining");
    }
    return;
  });
});

describe("POST /soda ", () => {
  test("responds with code 400 when missing the appropriate body", async () => {
    const response = await request.post("/soda").send({incorrect: "Pop"});
    const data = JSON.parse(response.text);
    expect(data.code).toEqual(400);
    expect(data.msg).toEqual("Need productName");
    return;
  });
  test("responds with code 401 when the soda does not exist", async () => {
    const response = await request.post("/soda").send({productName: "Nonexistent"});
    const data = JSON.parse(response.text);
    expect(data.code).toEqual(401);
    expect(data.msg).toEqual("Soda was not found");
    return;
  });
  test("responds with the specified soda when given the appropriate body", async () => {
    const response = await request.post("/soda").send({productName: "Pop"});
    const data = JSON.parse(response.text);
    expect(data.code).toEqual(200);
    expect(data.data.productName).toEqual("Pop");
    expect(data.data).toHaveProperty("description");
    expect(data.data).toHaveProperty("cost");
    expect(data.data).toHaveProperty("max");
    expect(data.data).toHaveProperty("remaining");
    return;
  });
});