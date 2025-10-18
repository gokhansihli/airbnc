require("jest-sorted");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

afterAll(async () => {
  await db.end();
});

describe("POST api/properties/:id/reviews", () => {
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
  test("Responds with status 401 if token is not verified", async () => {
    const { body } = await request(app).delete("/api/reviews/1").expect(401);
    expect(body.msg).toBe("Access denied!");
  });
});
describe("GET api/users/:id", () => {
  test("Responds with status 401 if token is not verified", async () => {
    const { body } = await request(app).get("/api/users/1").expect(401);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("PATCH api/users/:id", () => {
  test("Responds with status 401 if token is not verified", async () => {
    const testUser = { first_name: "Aley" };
    const { body } = await request(app).patch("/api/users/1").send(testUser);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("POST api/properties/:id/favourite", () => {
  test("Responds with status 401 if token is not verified", async () => {
    const testReview = { guest_id: 1 };

    const { body } = await request(app)
      .post("/api/properties/1/favourite")
      .send(testReview);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("DELETE api/properties/:id/users/:id/favourite", () => {
  test("Responds with status 401 if token is not verified", async () => {
    const { body } = await request(app)
      .delete("/api/properties/1/users/6/favourite")
      .expect(401);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("GET api/properties/:id/bookings", () => {
  test("Responds with status 401 if token is not verified", async () => {
    const { body } = await request(app)
      .get("/api/properties/1/bookings")
      .expect(401);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("POST api/properties/:id/booking", () => {
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
  test("Responds with status 401 if token is not verified", async () => {
    const { body } = await request(app).delete("/api/bookings/1").expect(401);

    expect(body.msg).toBe("Access denied!");
  });
});
describe("PATCH api/bookings/:id", () => {
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
  test("Responds with status 401 if token is not verified", async () => {
    const { body } = await request(app)
      .get("/api/users/1/bookings")
      .expect(401);

    expect(body.msg).toBe("Access denied!");
  });
});
