require("jest-sorted");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seed");
const testData = require("../db/data/test/index");

beforeEach(async () => {
  await seed(testData);
});

afterAll(async () => {
  await db.end();
});

describe("app", () => {
  test("404 Path not found!", async () => {
    const { body } = await request(app).get("/invalid/path").expect(404);
    expect(body.msg).toBe("Path not found!");
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

      body.properties.forEach((property) =>
        expect(typeof property).toBe("object")
      );
    });
    test("Every single property should has correct shape", async () => {
      const { body } = await request(app).get("/api/properties");

      body.properties.forEach((property) => {
        expect(property).toHaveProperty("property_id");
        expect(property).toHaveProperty("name");
        expect(property).toHaveProperty("location");
        expect(property).toHaveProperty("price_per_night");
        expect(property).toHaveProperty("host");
        expect(property).toHaveProperty("image");
      });
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
    test("should return first image associated with each property", async () => {
      const { body } = await request(app).get("/api/properties");

      expect(body.properties[0].image).toBe(
        "https://example.com/images/cosy_family_house_1.jpg"
      );
    });
    describe("Optional Queries", () => {
      test("Should filter min cost per night", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ minprice: 20 });

        const testProperties = body.properties;

        expect(testProperties).toBeSortedBy("favourited_count", {
          descending: true,
        });
      });
      test("Should filter max cost per night", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ maxprice: 2000 });

        const testProperties = body.properties;

        expect(testProperties).toBeSortedBy("favourited_count", {
          descending: true,
        });
      });
      test("Should filter through property type", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ property_type: "apartment" });

        const properties = body.properties;

        const expectedIds = [1, 4, 6, 9];

        properties.forEach((property) => {
          expect(expectedIds).toContain(property.property_id);
        });
      });
      test("Should sort by cost per night", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ sort: "cost_per_night" });

        expect(body.properties).toBeSortedBy("price_per_night", {
          descending: true,
        });
      });
      test("Should sort by popularity", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ sort: "popularity" });

        expect(body.properties).toBeSortedBy("avg_rating", {
          descending: true,
        });
      });
      test("Should order by ascending", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ order: "asc" });

        expect(body.properties).toBeSortedBy("favourited_count");
      });
      test("Should order by descending", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ order: "desc" });
        expect(body.properties).toBeSortedBy("favourited_count", {
          descending: true,
        });
      });
      test("Should filter by minprice and sort by cost per night ascending", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ minprice: 100, sort: "cost_per_night", order: "asc" });

        expect(body.properties).toBeSortedBy("price_per_night");
      });
      test("Should filter by host which belong to the passed host_id", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ host: 1 });

        body.properties.forEach((property) => {
          expect(property.host).toBe("Alice Johnson");
        });
      });
      test("Responds with empty array and status 200 if host doesn't have property", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ host: 2 })
          .expect(200);

        expect(body.properties).toEqual([]);
      });
      test("Responds with status 404 if host is not exist", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ host: 99999 })
          .expect(404);

        expect(body.msg).toBe("Resource not found!");
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
      test("Responds with status 400 if host value is not number", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ host: "sdgsdg" })
          .expect(400);

        expect(body.msg).toBe("Invalid host value!");
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

        expect(property).toHaveProperty("property_id");
        expect(property).toHaveProperty("property_name");
        expect(property).toHaveProperty("location");
        expect(property).toHaveProperty("price_per_night");
        expect(property).toHaveProperty("description");
        expect(property).toHaveProperty("host");
        expect(property).toHaveProperty("host_avatar");
        expect(property).toHaveProperty("favourited_count");
        expect(property).toHaveProperty("images");
      });
      test("Property should has an images property with an array of images", async () => {
        const { body } = await request(app).get("/api/properties/1");

        const images = body.property.images;

        expect(Array.isArray(images)).toBe(true);
        images.forEach((image) => {
          expect(typeof image).toBe("string");
        });
      });
      test("Property should take optional query as user_id", async () => {
        const { body } = await request(app)
          .get("/api/properties/1")
          .query({ user_id: 1 });

        const testFavourited = body.property.favourited;

        expect(typeof testFavourited).toBe("boolean");
      });
      test("Responds with status of 400 if user id is not number", async () => {
        const { body } = await request(app)
          .get("/api/properties/2")
          .query({ user_id: "abc" })
          .expect(400);

        expect(body.msg).toBe("Invalid user id value!");
      });
      test("Responds with status of 400 if id is not a number", async () => {
        const { body } = await request(app)
          .get("/api/properties/abc")
          .expect(400);

        expect(body.msg).toBe("Invalid property value!");
      });
      test("Responds with status of 404 if passed number is not included in user id", async () => {
        const { body } = await request(app)
          .get("/api/properties/2")
          .query({ user_id: 10000 })
          .expect(404);

        expect(body.msg).toBe("Resource not found!");
      });
      test("Responds with status of 404 if passed number is not included in properties", async () => {
        const { body } = await request(app)
          .get("/api/properties/100000")
          .expect(404);

        expect(body.msg).toBe("Resource not found!");
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
    test("Responds with empty array and status 200 if there is no review on property", async () => {
      await request(app).get("/api/properties/2/reviews").expect(200);
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

      expect(body.msg).toBe("Resource not found!");
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
    test("Should respond with newly inserted review", async () => {
      const testReview = {
        guest_id: 1,
        rating: 4,
        comment: "nice to see",
      };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(201);

      expect(body.review).toEqual({
        ...testReview,
        review_id: 17,
        property_id: 1,
        created_at: expect.anything(),
      });
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

      expect(body.msg).toBe("Comment should be provided!");
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

      expect(body.msg).toBe("Rating should be provided!");
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

      expect(body.msg).toBe("Guest id should be provided!");
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
        guest_id: 1,
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
  describe("DELETE api/reviews/:id", () => {
    test("Responds with status of 204", async () => {
      await request(app).delete("/api/reviews/1").expect(204);
    });
    test("Should respond with empty object after deletion", async () => {
      const { body } = await request(app).delete("/api/reviews/1").expect(204);
      expect(body).toEqual({});
    });
    test("Responds with status 400 if id is not a number", async () => {
      const { body } = await request(app)
        .delete("/api/reviews/abc")
        .expect(400);

      expect(body.msg).toBe("Invalid review value!");
    });
    test("Responds with status 404 if review id is not exist", async () => {
      const { body } = await request(app)
        .delete("/api/reviews/999")
        .expect(404);
      expect(body.msg).toBe("Resource not found!");
    });
  });
  describe("PATCH api/users/:id", () => {
    test("Respond with status of 200", async () => {
      await request(app)
        .patch("/api/users/1")
        .send({ first_name: "TestName" })
        .expect(200);
    });
    test("Should update single passed field", async () => {
      const testUser = { first_name: "Aley" };
      const { body } = await request(app).patch("/api/users/1").send(testUser);

      expect(body.user).toHaveProperty("first_name", "Aley");
    });
    test("Should update multiple passed fields", async () => {
      const testUser = { surname: "Aley", email: "example@example.com" };
      const { body } = await request(app).patch("/api/users/1").send(testUser);

      expect(body.user).toHaveProperty("surname", "Aley");
      expect(body.user).toHaveProperty("email", "example@example.com");
    });
    test("Should update all passed fields", async () => {
      const testUser = {
        first_name: "David",
        surname: "Aley",
        email: "example@example.com",
        phone: "+44 07123456",
        avatar: "https://e.com/images/j.jpg",
      };
      const { body } = await request(app).patch("/api/users/1").send(testUser);

      expect(body.user).toHaveProperty("first_name", "David");
      expect(body.user).toHaveProperty("surname", "Aley");
      expect(body.user).toHaveProperty("email", "example@example.com");
      expect(body.user).toHaveProperty("phone", "+44 07123456");
      expect(body.user).toHaveProperty("avatar", "https://e.com/images/j.jpg");
    });
    test("Should respond all user properties with updated fields", async () => {
      const testUser = { avatar: "https://e.com/images/s.jpg" };

      const { body } = await request(app).patch("/api/users/1").send(testUser);

      expect(body.user).toHaveProperty("user_id", 1);
      expect(body.user).toHaveProperty("first_name", "Alice");
      expect(body.user).toHaveProperty("surname", "Johnson");
      expect(body.user).toHaveProperty("email", "alice@example.com");
      expect(body.user).toHaveProperty("phone", "+44 7000 111111");
      expect(body.user).toHaveProperty("avatar", "https://e.com/images/s.jpg");
      expect(body.user).toHaveProperty("is_host", true);
      expect(body.user).toHaveProperty("created_at");
    });
    test("Responds with 400 if passed field is invalid", async () => {
      const testUser = { hobby: "volleyball" };
      const { body } = await request(app)
        .patch("/api/users/1")
        .send(testUser)
        .expect(400);

      expect(body.msg).toBe("Invalid field!");
    });
    test("Responds with 404 if user id is not included", async () => {
      const testUser = { surname: "Aley" };
      const { body } = await request(app)
        .patch("/api/users/99999")
        .send(testUser)
        .expect(404);

      expect(body.msg).toBe("Resource not found!");
    });
  });
  describe("POST api/properties/:id/favourite", () => {
    test("Responds with status of 201", async () => {
      const testFavourite = { guest_id: 1 };

      await request(app)
        .post("/api/properties/1/favourite")
        .send(testFavourite)
        .expect(201);
    });
    test("Should return the favourite_id in the response", async () => {
      const testReview = { guest_id: 1 };

      const { body } = await request(app)
        .post("/api/properties/1/favourite")
        .send(testReview);

      expect(body).toHaveProperty("favorite_id", 16);
    });
    test("Should also post success message with status of 201", async () => {
      const testFavourite = { guest_id: 1 };

      const { body } = await request(app)
        .post("/api/properties/1/favourite")
        .send(testFavourite)
        .expect(201);

      expect(body.msg).toBe("Property favourited successfully.");
    });
    test("Responds with status of 400 if guest_id is not provided", async () => {
      const { body } = await request(app)
        .post("/api/properties/1/favourite")
        .send({})
        .expect(400);

      expect(body.msg).toBe("Guest id should be provided!");
    });
    test("Responds with status of 400 if guest_id is not a number", async () => {
      const { body } = await request(app)
        .post("/api/properties/1/favourite")
        .send({ guest_id: "abc" })
        .expect(400);

      expect(body.msg).toBe("Guest id should be number!");
    });
  });
  describe("DELETE api/properties/:id/users/:id/favourite", () => {
    test("Responds with status of 204", async () => {
      await request(app)
        .delete("/api/properties/1/users/6/favourite")
        .expect(204);
    });
    test("Should delete favourite after delete request", async () => {
      const { body } = await request(app)
        .delete("/api/properties/1/users/6/favourite")
        .expect(204);

      const testFavourite = await db.query(
        `SELECT * FROM favourites WHERE property_id = 1 AND guest_id = 6`
      );
      expect(testFavourite.rows.length).toBe(0);
    });
    test("Should respond with empty object after delete request", async () => {
      const { body } = await request(app)
        .delete("/api/properties/1/users/6/favourite")
        .expect(204);
      expect(body).toEqual({});
    });
    test("Responds with status 400 if property_id is not a number", async () => {
      const { body } = await request(app)
        .delete("/api/properties/abc/users/6/favourite")
        .expect(400);

      expect(body.msg).toBe("Invalid property value!");
    });
    test("Responds with status 400 if user_id is not a number", async () => {
      const { body } = await request(app)
        .delete("/api/properties/1/users/abc/favourite")
        .expect(400);

      expect(body.msg).toBe("Invalid user value!");
    });
    test("Responds with status 404 if property_id is not exist", async () => {
      const { body } = await request(app)
        .delete("/api/properties/9999/users/6/favourite")
        .expect(404);

      expect(body.msg).toBe("Resource not found!");
    });
    test("Responds with status 404 if user_id is not exist", async () => {
      const { body } = await request(app)
        .delete("/api/properties/1/users/99999/favourite")
        .expect(404);

      expect(body.msg).toBe("Resource not found!");
    });
  });
});
