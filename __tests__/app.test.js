const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

afterAll(async () => {
  await db.end();
});

describe("app", () => {
  test("404 Path not found!", async () => {
    const { body } = await request(app).get("/invalid/path").expect(404);
    expect(body.msg).toBe("Path not found!");
  });
  describe("GET api/properties", () => {
    test("Responds with status of 200", async () => {
      await request(app).get("/api/properties").expect(200);
    });
    test("Responds with an array on the key of properties", async () => {
      const { body } = await request(app).get("/api/properties");

      expect(Array.isArray(body.properties)).toBe(true);
    });
    test("Each property in the array should be an object", async () => {
      const { body } = await request(app).get("/api/properties");

      expect(typeof body.properties[0]).toBe("object");
    });
    test("Single property should has correct shape", async () => {
      const { body } = await request(app).get("/api/properties");

      const property = body.properties[0];

      expect(typeof property.property_id).toBe("number");
      expect(typeof property.name).toBe("string");
      expect(typeof property.location).toBe("string");
      expect(typeof property.price_per_night).toBe("number");
      expect(typeof property.host).toBe("string");
    });
    test("Should return the correct number of properties", async () => {
      const { body } = await request(app).get("/api/properties");

      expect(body.properties.length).toBe(11);
    });
    test("Should return the correct order of properties", async () => {
      const { body } = await request(app).get("/api/properties");

      const propertyId = body.properties[0].property_id;

      expect(propertyId).toBe(2);
    });
    describe("Optional Queries", () => {
      test("Should filter min and max cost per night", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ minprice: 20, maxprice: 2000 });

        const testProperties = body.properties;

        const minPrice = testProperties[0].price_per_night;
        const maxPrice =
          testProperties[testProperties.length - 1].price_per_night;

        expect(minPrice).toBeGreaterThanOrEqual(50);
        expect(maxPrice).toBeLessThanOrEqual(150);
      });
      test("Should filter through property type", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ property_type: "apartment" });

        const property = body.properties[0];

        expect(property.property_id).toBe(1);
      });
      test("Should sort by cost per night", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ sort: "cost_per_night" });

        const firstPrice = body.properties[0].price_per_night;
        const secondPrice = body.properties[1].price_per_night;

        expect(firstPrice).toBeGreaterThanOrEqual(secondPrice);
      });
      test("Should sort by popularity", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ sort: "popularity" });

        const testProperties = body.properties;

        const firstRating = testProperties[0].avg_rating;
        const lastRating = testProperties[testProperties.length - 1].avg_rating;

        expect(firstRating).toBeGreaterThanOrEqual(lastRating);
      });
      test("Should order by ascending", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ order: "asc" });

        const testProperties = body.properties;

        const firstFavourited = testProperties[0].favourited_count;
        const lastFavourited =
          testProperties[testProperties.length - 1].favourited_count;

        expect(+lastFavourited).toBeGreaterThanOrEqual(+firstFavourited);
      });
      test("Should order by descending", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ order: "desc" });

        const testProperties = body.properties;

        const firstFavourited = testProperties[0].favourited_count;
        const lastFavourited =
          testProperties[testProperties.length - 1].favourited_count;

        expect(+firstFavourited).toBeGreaterThanOrEqual(+lastFavourited);
      });
      test("Responds with status 400 if property_type value is not number", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ property_type: "sdgsdg" })
          .expect(400);

        expect(body.msg).toBe("Invalid property type value!");
      });
      test("Responds with status 400 if minprice and maxprice values are not number", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ minprice: "sdgsdg" })
          .expect(400);

        expect(body.msg).toBe("Invalid price value!");
      });
      test("Responds with status 400 if sort value is incorrect", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ sort: "gfgfjj" })
          .expect(400);

        expect(body.msg).toBe("Invalid sort value!");
      });
      test("Responds with status 400 if order value is incorrect", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ order: "gfgfjj" })
          .expect(400);

        expect(body.msg).toBe("Invalid order value!");
      });
    });
    describe("GET api/properties/:id", () => {
      test("Responds with status of 200", async () => {
        await request(app).get("/api/properties/1").expect(200);
      });
      test("Property should be an object", async () => {
        const { body } = await request(app).get("/api/properties/1");

        const property = body.property;

        expect(typeof property).toBe("object");
      });
      test("Property should match with id", async () => {
        const { body } = await request(app).get("/api/properties/1");

        const property = body.property;

        expect(property.property_id).toBe(1);
      });
      test("Property should has correct shape", async () => {
        const { body } = await request(app).get("/api/properties/1");

        const property = body.property;

        expect(typeof property.property_id).toBe("number");
        expect(typeof property.property_name).toBe("string");
        expect(typeof property.location).toBe("string");
        expect(typeof property.price_per_night).toBe("number");
        expect(typeof property.description).toBe("string");
        expect(typeof property.host).toBe("string");
        expect(typeof property.host_avatar).toBe("string");
        expect(typeof property.favourited_count).toBe("string");
      });
      test("Property should take optional query as user_id", async () => {
        const { body } = await request(app)
          .get("/api/properties/1")
          .query({ user_id: 1 });

        const testFavourited = body.property.favourited;

        expect(typeof testFavourited).toBe("boolean");
      });
      test("Responds with status 400 if user id is not number", async () => {
        const { body } = await request(app)
          .get("/api/properties/2")
          .query({ user_id: "abc" })
          .expect(400);

        expect(body.msg).toBe("Invalid user id value!");
      });
      test("Responds with status 400 if id is not a number", async () => {
        const { body } = await request(app)
          .get("/api/properties/abc")
          .expect(400);

        expect(body.msg).toBe("Invalid property value!");
      });
      test("Responds with status 404 if passed number is not included in user id", async () => {
        const { body } = await request(app)
          .get("/api/properties/2")
          .query({ user_id: 10000 })
          .expect(404);

        expect(body.msg).toBe("Property not found!");
      });
      test("Responds with status 404 if passed number is not included in properties", async () => {
        const { body } = await request(app)
          .get("/api/properties/100000")
          .expect(404);

        expect(body.msg).toBe("Property not found!");
      });
    });
  });
  describe("GET api/properties/:id/reviews", () => {
    test("Responds with status of 200", async () => {
      await request(app).get("/api/properties/1/reviews").expect(200);
    });
    test("Responds with an object with correct keys", async () => {
      const { body } = await request(app).get("/api/properties/1/reviews");

      expect(typeof body).toBe("object");
      expect(body).toHaveProperty("reviews");
      expect(body).toHaveProperty("average_rating");
    });
    test("Reviews responds with an array on the key of property", async () => {
      const { body } = await request(app).get("/api/properties/1/reviews");
      expect(Array.isArray(body.reviews)).toBe(true);
    });
    test("Reviews property should has correct shape", async () => {
      const { body } = await request(app).get("/api/properties/1/reviews");

      const property = body.reviews[0];

      expect(typeof property.review_id).toBe("number");
      expect(typeof property.comment).toBe("string");
      expect(typeof property.rating).toBe("number");
      expect(typeof property.created_at).toBe("string");
      expect(typeof property.guest).toBe("string");
      expect(typeof property.guest_avatar).toBe("string");
    });
    test("Responds with the correct average rating", async () => {
      const { body } = await request(app).get("/api/properties/1/reviews");

      expect(body.average_rating).toBe(3);
    });
    test("Reviews should order by latest to oldest", async () => {
      const { body } = await request(app).get("/api/properties/1/reviews");

      expect(body.reviews[0].created_at).toBe("2025-02-28T08:30:00.000Z");
    });
    test("Responds with status 404 if there is no review on property", async () => {
      const { body } = await request(app)
        .get("/api/properties/2/reviews")
        .expect(404);
      expect(body.msg).toBe("Property not found!");
    });
  });
  describe("GET api/users/:id", () => {
    test("Responds with status of 200", async () => {
      await request(app).get("/api/users/1").expect(200);
    });
    test("User should be an object", async () => {
      const { body } = await request(app).get("/api/users/1");

      const user = body.user;

      expect(typeof user).toBe("object");
    });
    test("user should match with id", async () => {
      const { body } = await request(app).get("/api/users/1");

      const user = body.user;

      expect(user.user_id).toBe(1);
    });
    test("User should has correct shape", async () => {
      const { body } = await request(app).get("/api/users/1");

      const user = body.user;

      expect(typeof user.user_id).toBe("number");
      expect(typeof user.first_name).toBe("string");
      expect(typeof user.surname).toBe("string");
      expect(typeof user.email).toBe("string");
      expect(typeof user.phone_number).toBe("string");
      expect(typeof user.avatar).toBe("string");
      expect(typeof user.created_at).toBe("string");
    });
    test("Responds with status 400 if id is not a number", async () => {
      const { body } = await request(app).get("/api/users/abc").expect(400);

      expect(body.msg).toBe("Invalid user value!");
    });
    test("Responds with status 404 if passed number is not included in users", async () => {
      const { body } = await request(app).get("/api/users/100000").expect(404);

      expect(body.msg).toBe("User not found!");
    });
  });
  describe("POST api/properties/:id/reviews", () => {
    test("Responds with status of 201", async () => {
      const testReview = {
        guest_id: 1,
        rating: 4,
        comment: "nice to see",
      };

      await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(201);
    });
    test("Should responds with newly inserted review", async () => {
      const testReview = {
        guest_id: 1,
        rating: 4,
        comment: "nice to see",
      };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(201);

      expect(body.review).toEqual([
        {
          ...testReview,
          review_id: 18,
          property_id: 1,
          created_at: expect.anything(),
        },
      ]);
    });
    test("Responds with status of 400 if comment is not provided", async () => {
      const testReview = {
        guest_id: 1,
        rating: 4,
      };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request!");
    });
    test("Responds with status of 400 if rating is not provided", async () => {
      const testReview = {
        guest_id: 1,
        comment: "dfsdf",
      };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request!");
    });
    test("Responds with status of 400 if guest id is not provided", async () => {
      const testReview = {
        rating: 4,
        comment: "dfsdf",
      };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request!");
    });
    test("Responds with status of 400 if passed proprerty id number is not exist", async () => {
      const testReview = {
        guest_id: 1,
        rating: 4,
        comment: "dfsdf",
      };

      const { body } = await request(app)
        .post("/api/properties/100000/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request!");
    });
    test("Responds with status of 400 if passed guest_id number is not exist", async () => {
      const testReview = {
        guest_id: 100000,
        rating: 4,
        comment: "dfsdf",
      };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request!");
    });
    test("Responds with status of 400 if rating is not number", async () => {
      const testReview = {
        guest_id: 100000,
        rating: "abc",
        comment: "dfsdf",
      };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request!");
    });
  });
});
