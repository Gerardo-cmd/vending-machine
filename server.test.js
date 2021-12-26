const supertest = require("supertest");
const app = require("./app");
const request = supertest(app);

describe("GET /sodas ", () => {
  test("responds with the array of sodas", async () => {
    const response = await request.get("/sodas");
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(200);
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
    expect(response.statusCode).toEqual(400);
    expect(data.msg).toEqual("Need productName");
    return;
  });
  test("responds with code 401 when the soda does not exist", async () => {
    const response = await request.post("/soda").send({productName: "Nonexistent"});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(401);
    expect(data.msg).toEqual("Soda was not found");
    return;
  });
  test("responds with the specified soda when given the appropriate body", async () => {
    const response = await request.post("/soda").send({productName: "Pop"});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(200);
    expect(data.data.productName).toEqual("Pop");
    expect(data.data).toHaveProperty("description");
    expect(data.data).toHaveProperty("cost");
    expect(data.data).toHaveProperty("max");
    expect(data.data).toHaveProperty("remaining");
    return;
  });
});

describe("POST /login ", () => {
  test("responds with code 400 when missing the appropriate body", async () => {
    const response = await request.post("/login").send({incorrect: "wrongpassword"});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(400);
    expect(data.msg).toEqual("Need password");
    return;
  });
  test("responds with code 401 when password is incorrect", async () => {
    const response = await request.post("/login").send({password: "wrongpassword"});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(401);
    expect(data.msg).toEqual("Incorrect Password");
    return;
  });
});

describe("POST /product-update ", () => {
  test("responds with code 400 when not authorized", async () => {
    const response = await request.post("/product-update").send({productName: "Pop", newProductName: "New Soda", newCost: "2 dollar US", newDescription: "This is not authorized", newMax: 100});
    expect(response.statusCode).toEqual(400);
    return;
  });
  test("responds with code 400 when missing the appropriate body", async () => {
    const response = await request.post("/product-update").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "missing body fields"});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(400);
    expect(data.msg).toEqual("Need productName, newProductName, description, cost, and max");
    return;
  });
  test("responds with code 401 when soda is not found", async () => {
    const response = await request.post("/product-update").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "I don't exist", newProductName: "New Soda", newCost: "2 dollar US", newDescription: "This will not work", newMax: 100});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(401);
    expect(data.msg).toEqual("Soda was not found");
    return;
  });
  test("responds with code 200 when authorized and all fields are present", async () => {
    const sodas = await request.get("/sodas");
    const testSoda = JSON.parse(sodas.text).data[0];
    const response = await request.post("/product-update").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: testSoda.productName, newProductName: "New Soda", newCost: testSoda.cost, newDescription: testSoda.description, newMax: parseInt(testSoda.max) + 50});
    const alteredSoda = JSON.parse(response.text).data;
    expect(response.statusCode).toEqual(200);
    expect(alteredSoda.productName).toEqual("New Soda");
    expect(alteredSoda.max).toEqual(parseInt(testSoda.max)+50);
    const lastResponse = await request.post("/product-update").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "New Soda", newProductName: testSoda.productName, newCost: testSoda.cost, newDescription: testSoda.description, newMax: parseInt(testSoda.max)});
    const originalSoda = JSON.parse(lastResponse.text).data;
    expect(lastResponse.statusCode).toEqual(200);
    expect(originalSoda.productName).toEqual(testSoda.productName);
    expect(originalSoda.max).toEqual(parseInt(testSoda.max));
    return;
  });
});

describe("POST /restock ", () => {
  test("responds with code 400 when not authorized", async () => {
    const response = await request.post("/restock").send({productName: "missing quantity"});
    expect(response.statusCode).toEqual(400);
    return;
  });
  test("responds with code 400 when missing the appropriate body", async () => {
    const response = await request.post("/restock").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "missing quantity"});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(400);
    expect(data.msg).toEqual("Need productName and quantity");
    return;
  });
  test("responds with code 401 when soda is not found", async () => {
    const response = await request.post("/restock").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "I don't exist", quantity: 300});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(401);
    expect(data.msg).toEqual("Soda was not found");
    return;
  });
  test("responds with code 401 when quantity would cause overflow", async () => {
    const sodas = await request.get("/sodas");
    const testName = JSON.parse(sodas.text).data[0].productName;
    await request.post("/soda").send({productName: testName});
    const response = await request.post("/restock").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: testName, quantity: 1000});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(402);
    expect(data.msg).toEqual("Cannot restock by that amount for it will overflow");
    return;
  });
  test("responds with code 200 when quantity is appropriate", async () => {
    const sodas = await request.get("/sodas");
    const testName = JSON.parse(sodas.text).data[0].productName;
    await request.post("/soda").send({productName: testName});
    const response = await request.post("/restock").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: testName, quantity: 1});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(200);
    return;
  });
});

describe("POST /new-product ", () => {
  test("responds with code 400 when not authorized", async () => {
    const response = await request.post("/new-product").send({productName: "missing quantity"});
    expect(response.statusCode).toEqual(400);
    return;
  });
  test("responds with code 400 when missing the appropriate body", async () => {
    const response = await request.post("/new-product").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "missing quantity"});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(400);
    expect(data.msg).toEqual("Need productName, description, cost, and max");
    return;
  });
  test("responds with code 401 if soda already exists", async () => {
    const sodas = await request.get("/sodas");
    const testName = JSON.parse(sodas.text).data[0].productName;
    const response = await request.post("/new-product").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: testName, cost: "2 dollar US", description: "This soda name should already be taken", max: 300});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(401);
    expect(data.msg).toEqual("A soda with that name already exists");
    return;
  });
  test("responds with code 200 and creates new product when authorized, required fields are present, and soda does not exist yet", async () => {
    const response = await request.post("/new-product").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "New Soda", cost: "2 dollar US", description: "This soda is new and hopefully will taste good", max: 25});
    expect(response.statusCode).toEqual(200);
    await request.post("/restock").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "New Soda", quantity: 25});
    await new Promise((r) => setTimeout(r, 100));
    const newResponse = await request.post("/soda").send({productName: "New Soda"});
    const newData = JSON.parse(newResponse.text).data;
    expect(newResponse.statusCode).toEqual(200);
    expect(newData.productName).toEqual("New Soda");
    expect(newData.description).toEqual("This soda is new and hopefully will taste good");
    expect(newData.cost).toEqual("2 dollar US");
    expect(newData.max).toEqual(25);
    expect(newData.remaining).toEqual(24);
    await request.delete("/product-removal").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "New Soda"});
    return;
  });
});

describe("POST /product-removal ", () => {
  test("responds with code 400 when not authorized", async () => {
    const response = await request.delete("/product-removal").send({productName: "New Soda"});
    expect(response.statusCode).toEqual(400);
    return;
  });
  test("responds with code 400 when missing the appropriate body", async () => {
    const response = await request.delete("/product-removal").set('Authorization', 'bearer ' + process.env.TOKEN).send({wrongField: "missing quantity"});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(400);
    expect(data.msg).toEqual("Need productName");
    return;
  });
  test("responds with code 401 if soda deos not exist", async () => {
    const response = await request.delete("/product-removal").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "Nonexistent"});
    const data = JSON.parse(response.text);
    expect(response.statusCode).toEqual(401);
    expect(data.msg).toEqual("Soda was not found");
    return;
  });
  test("responds with code 200 and removes the product when authorized, required fields are present, and soda exists", async () => {
    const response = await request.post("/new-product").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "New Soda", cost: "2 dollar US", description: "This soda is new and hopefully will taste good", max: 25});
    expect(response.statusCode).toEqual(200);
    await request.post("/restock").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "New Soda", quantity: 25});
    await new Promise((r) => setTimeout(r, 100));
    const newResponse = await request.post("/soda").send({productName: "New Soda"});
    expect(newResponse.statusCode).toEqual(200);
    await request.delete("/product-removal").set('Authorization', 'bearer ' + process.env.TOKEN).send({productName: "New Soda"});
    const lastResponse = await request.post("/soda").send({productName: "New Soda"});
    expect(lastResponse.statusCode).toEqual(401);
    expect(JSON.parse(lastResponse.text).msg).toEqual("Soda was not found");
    return;
  });
});