require("jest-sorted");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seed");
const testData = require("../db/data/test/index");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = process.env;

beforeEach(async () => {
  await seed(testData);
});

afterAll(async () => {
  await db.end();
});

const token1 = jwt.sign({ id: 1, email: "userA@example.com" }, TOKEN_SECRET);
const token2 = jwt.sign({ id: 2, email: "userB@example.com" }, TOKEN_SECRET);
const token4 = jwt.sign({ id: 4, email: "userC@example.com" }, TOKEN_SECRET);

describe("POST api/properties/:id/reviews", () => {
  test("Responds with status 200 if user authorised", async () => {
    const testReview = {
      guest_id: 1,
      rating: 4,
      comment: "nice to see",
    };

    await request(app)
      .post("/api/properties/1/reviews")
      .send(testReview)
      .set("Authorization", `Bearer ${token1}`)
      .expect(201);
  });
  test("Responds with status 403 if user not authorised", async () => {
    const testReview = {
      guest_id: 1,
      rating: 4,
      comment: "nice to see",
    };

    const { body } = await request(app)
      .post("/api/properties/1/reviews")
      .send(testReview)
      .set("Authorization", `Bearer ${token2}`)
      .expect(403);

    expect(body.msg).toBe("Access denied!");
  });
  test("Responds with status 401 if token is not verified", async () => {
    const testReview = {
      guest_id: 1,
      rating: 4,
      comment: "nice to see",
    };

    const { body } = await request(app)
      .post("/api/properties/1/reviews")
      .send(testReview)
      .expect(401);
    expect(body.msg).toBe("Access denied!");
  });
});
describe("DELETE api/reviews/:id", () => {
  test("Responds with status 200 if user authorised", async () => {
    await request(app)
      .delete("/api/reviews/1")
      .set("Authorization", `Bearer ${token4}`)
      .expect(204);
  });
  test("Responds with status 403 if user not authorised", async () => {
    const { body } = await request(app)
      .delete("/api/reviews/1")
      .set("Authorization", `Bearer ${token1}`)
      .expect(403);

    expect(body.msg).toBe("Access denied!");
  });
  test("Responds with status 401 if token is not verified", async () => {
    const { body } = await request(app).delete("/api/reviews/1").expect(401);
    expect(body.msg).toBe("Access denied!");
  });
});
describe("GET api/users/:id", () => {
  test("Responds with status 200 if user authorised", async () => {
    await request(app)
      .get("/api/users/1")
      .set("Authorization", `Bearer ${token1}`)
      .expect(200);
  });
  test("Responds with status 403 if user not authorised", async () => {
    const { body } = await request(app)
      .get("/api/users/1")
      .set("Authorization", `Bearer ${token2}`)
      .expect(403);

    expect(body.msg).toBe("Access denied!");
  });
  test("Responds with status 401 if token is not verified", async () => {
    const { body } = await request(app).get("/api/users/1").expect(401);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("PATCH api/users/:id", () => {
  test("Responds with status 200 if user authorised", async () => {
    await request(app)
      .patch("/api/users/1")
      .send({ first_name: "TestName" })
      .set("Authorization", `Bearer ${token1}`)
      .expect(200);
  });
  test("Responds with status 403 if user not authorised", async () => {
    const { body } = await request(app)
      .patch("/api/users/1")
      .send({ first_name: "TestName" })
      .set("Authorization", `Bearer ${token2}`)
      .expect(403);

    expect(body.msg).toBe("Access denied!");
  });
  test("Responds with status 401 if token is not verified", async () => {
    const testUser = { first_name: "Aley" };
    const { body } = await request(app).patch("/api/users/1").send(testUser);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("POST api/properties/:id/favourite", () => {
  test("Responds with status 200 if user authorised", async () => {
    const testFavourite = { guest_id: 1 };

    await request(app)
      .post("/api/properties/1/favourite")
      .send(testFavourite)
      .set("Authorization", `Bearer ${token1}`)
      .expect(201);
  });
  test("Responds with status 403 if user not authorised", async () => {
    const testFavourite = { guest_id: 1 };

    const { body } = await request(app)
      .post("/api/properties/1/favourite")
      .send(testFavourite)
      .set("Authorization", `Bearer ${token2}`)
      .expect(403);

    expect(body.msg).toBe("Access denied!");
  });
  test("Responds with status 401 if token is not verified", async () => {
    const testFavourite = { guest_id: 1 };

    const { body } = await request(app)
      .post("/api/properties/1/favourite")
      .send(testFavourite);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("DELETE api/properties/:id/users/:id/favourite", () => {
  test("Responds with status 200 if user authorised", async () => {
    await request(app)
      .delete("/api/properties/2/users/2/favourite")
      .set("Authorization", `Bearer ${token2}`)
      .expect(204);
  });
  test("Responds with status 403 if user not authorised", async () => {
    const { body } = await request(app)
      .delete("/api/properties/1/users/2/favourite")
      .set("Authorization", `Bearer ${token2}`)
      .expect(403);

    expect(body.msg).toBe("Access denied!");
  });
  test("Responds with status 401 if token is not verified", async () => {
    const { body } = await request(app)
      .delete("/api/properties/1/users/6/favourite")
      .expect(401);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("GET api/properties/:id/bookings", () => {
  test("Responds with status 200 if user authorised", async () => {
    await request(app)
      .get("/api/properties/1/bookings")
      .set("Authorization", `Bearer ${token2}`)
      .expect(200);
  });
  test("Responds with status 401 if token is not verified", async () => {
    const { body } = await request(app)
      .get("/api/properties/1/bookings")
      .expect(401);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("POST api/properties/:id/booking", () => {
  test("Responds with status 200 if user authorised", async () => {
    const testBooking = {
      guest_id: 1,
      check_in_date: "2026-12-01T00:00:00.000Z",
      check_out_date: "2026-12-05T00:00:00.000Z",
    };
    await request(app)
      .post("/api/properties/1/booking")
      .send(testBooking)
      .set("Authorization", `Bearer ${token1}`)
      .expect(201);
  });
  test("Responds with status 403 if user not authorised", async () => {
    const testBooking = {
      guest_id: 1,
      check_in_date: "2027-12-01T00:00:00.000Z",
      check_out_date: "2027-12-05T00:00:00.000Z",
    };
    const { body } = await request(app)
      .post("/api/properties/1/booking")
      .send(testBooking)
      .set("Authorization", `Bearer ${token2}`)
      .expect(403);

    expect(body.msg).toBe("Access denied!");
  });
  test("Responds with status 401 if token is not verified", async () => {
    const testBooking = {
      guest_id: 2,
      check_in_date: "2026-12-01T00:00:00.000Z",
      check_out_date: "2026-12-05T00:00:00.000Z",
    };
    const { body } = await request(app)
      .post("/api/properties/1/booking")
      .send(testBooking)
      .expect(401);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("DELETE api/bookings/:id", () => {
  test("Responds with status 200 if user authorised", async () => {
    await request(app)
      .delete("/api/bookings/1")
      .set("Authorization", `Bearer ${token2}`)
      .expect(204);
  });
  test("Responds with status 403 if user not authorised", async () => {
    const { body } = await request(app)
      .delete("/api/bookings/1")
      .set("Authorization", `Bearer ${token1}`)
      .expect(403);

    expect(body.msg).toBe("Access denied!");
  });
  test("Responds with status 401 if token is not verified", async () => {
    const { body } = await request(app).delete("/api/bookings/1").expect(401);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("PATCH api/bookings/:id", () => {
  test("Responds with status 200 if user authorised", async () => {
    await request(app)
      .patch("/api/bookings/1")
      .send({ check_in_date: "2025-02-16T00:00:00.000Z" })
      .set("Authorization", `Bearer ${token2}`)
      .expect(200);
  });
  test("Responds with status 403 if user not authorised", async () => {
    const { body } = await request(app)
      .patch("/api/bookings/1")
      .send({ check_in_date: "2025-02-16T00:00:00.000Z" })
      .set("Authorization", `Bearer ${token1}`)
      .expect(403);

    expect(body.msg).toBe("Access denied!");
  });
  test("Responds with status 401 if token is not verified", async () => {
    const testBooking = { check_in_date: "2025-12-01T00:00:00.000Z" };
    const { body } = await request(app)
      .patch("/api/bookings/1")
      .send(testBooking)
      .expect(401);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("GET api/users/:id/bookings", () => {
  test("Responds with status 200 if user authorised", async () => {
    await request(app)
      .get("/api/users/1/bookings")
      .set("Authorization", `Bearer ${token1}`)
      .expect(200);
  });
  test("Responds with status 403 if user not authorised", async () => {
    const { body } = await request(app)
      .get("/api/users/1/bookings")
      .set("Authorization", `Bearer ${token2}`)
      .expect(403);

    expect(body.msg).toBe("Access denied!");
  });
  test("Responds with status 401 if token is not verified", async () => {
    const { body } = await request(app)
      .get("/api/users/1/bookings")
      .expect(401);

    expect(body.msg).toBe("Access denied!");
  });
});
