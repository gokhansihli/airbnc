require("jest-sorted");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seed");
const testData = require("../db/data/test/index");
const bcrypt = require("bcrypt");
const { insertSignup } = require("../models/signup");

let currentUser = { id: 1, email: "userA@example.com" };
const getCurrentUser = () => currentUser;

jest.mock("../routes/utils/Authentication-middleware", () => ({
  verifyToken: (req, res, next) => {
    req.user = getCurrentUser(); // fake logged-in user
    next();
  },
}));

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

      expect(body.properties).toBeSortedBy("favourited_count", {
        descending: true,
      });
    });
    test("should return first image associated with each property", async () => {
      const { body } = await request(app).get("/api/properties");

      expect(body.properties[0].image).toBe(
        "https://example.com/images/cosy_family_house_1.jpg"
      );
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "patch", "delete", "post"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/properties")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
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
          .query({ property_type: "Apartment" });

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
      test("Should filter by single amenity which contain that amenity", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ amenity: "Kitchen" });

        expect(body.properties[0]).toHaveProperty("property_id", 2);
        expect(body.properties[1]).toHaveProperty("property_id", 9);
        expect(body.properties[2]).toHaveProperty("property_id", 1);
        expect(body.properties[3]).toHaveProperty("property_id", 7);
      });
      test("Should filter by multiple amenities which contain that amenities", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ amenity: ["Kitchen", "TV"] });

        expect(body.properties[0]).toHaveProperty("property_id", 1);
        expect(body.properties[1]).toHaveProperty("property_id", 9);
        expect(body.properties[2]).toHaveProperty("property_id", 4);
      });
      test("Responds with status 400 if single amenity value is invalid", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ amenity: "abc" })
          .expect(400);

        expect(body.msg).toBe("Invalid amenity value!");
      });
      test("Responds with status 400 if multiple amenity values are invalid", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ amenity: ["abc", "fsdfs"] })
          .expect(400);

        expect(body.msg).toBe("Invalid amenity value!");
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
      test("Responds with status 400 if sort value is invalid", async () => {
        const { body } = await request(app)
          .get("/api/properties")
          .query({ sort: "gfgfjj" })
          .expect(400);

        expect(body.msg).toBe("Invalid sort value!");
      });
      test("Responds with status 400 if order value is invalid", async () => {
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

      const testImages = body.property.images;

      expect(Array.isArray(testImages)).toBe(true);
      testImages.forEach((image) => {
        expect(typeof image).toBe("string");
      });
    });
    test("Property should has an amenities property with an array of amenities", async () => {
      const { body } = await request(app).get("/api/properties/1");

      const testAmenities = body.property.amenities;

      expect(Array.isArray(testAmenities)).toBe(true);
      testAmenities.forEach((amenity) => {
        expect(typeof amenity).toBe("string");
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

      expect(body.msg).toBe("User value should be a number!");
    });
    test("Responds with status of 400 if property id is not a number", async () => {
      const { body } = await request(app)
        .get("/api/properties/abc")
        .expect(400);

      expect(body.msg).toBe("Property value should be a number!");
    });
    test("Responds with status of 404 if user id is not exist", async () => {
      const { body } = await request(app)
        .get("/api/properties/2")
        .query({ user_id: 10000 })
        .expect(404);

      expect(body.msg).toBe("User not found!");
    });
    test("Responds with status of 404 if property id is not exist", async () => {
      const { body } = await request(app)
        .get("/api/properties/100000")
        .expect(404);

      expect(body.msg).toBe("Property not found!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "patch", "delete", "post"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/properties/1")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
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

      expect(body.reviews.length).toBeGreaterThan(0);

      body.reviews.forEach((review) => {
        expect(typeof review.review_id).toBe("number");
        expect(typeof review.comment).toBe("string");
        expect(typeof review.rating).toBe("number");
        expect(typeof review.created_at).toBe("string");
        expect(typeof review.guest).toBe("string");
        expect(typeof review.guest_avatar).toBe("string");
      });
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
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "patch", "delete"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/properties/2/reviews")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
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

      expect(body.msg).toBe("Rating should be a number!");
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
    test("Responds with status of 400 if guest id is not number", async () => {
      const testReview = {
        guest_id: "abc",
        rating: 1,
        comment: "dfsdf",
      };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(400);

      expect(body.msg).toBe("Guest id should be a number!");
    });
    test("Responds with status of 404 if passed guest_id is not exist", async () => {
      const testReview = {
        guest_id: 999999,
        rating: 4,
        comment: "dfsdf",
      };

      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send(testReview)
        .expect(404);

      expect(body.msg).toBe("User not found!");
    });
    test("Responds with status of 404 if passed proprerty id number is not exist", async () => {
      const testReview = {
        guest_id: 1,
        rating: 4,
        comment: "dfsdf",
      };

      const { body } = await request(app)
        .post("/api/properties/999999/reviews")
        .send(testReview)
        .expect(404);

      expect(body.msg).toBe("Property not found!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "patch", "delete"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/properties/2/reviews")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
    });
  });
  describe("DELETE api/reviews/:id", () => {
    test("Responds with status of 204", async () => {
      currentUser = { id: 4, email: "userA@example.com" };
      await request(app).delete("/api/reviews/1").expect(204);
    });
    test("Should delete review and respond with empty object", async () => {
      const {
        rows: [reviewBeforeDeletion],
      } = await db.query(`SELECT * FROM reviews WHERE review_id = 1`);

      expect(reviewBeforeDeletion).toBeDefined();

      const { body } = await request(app).delete("/api/reviews/1").expect(204);
      const {
        rows: [reviewAfterDeletion],
      } = await db.query(`SELECT * FROM reviews WHERE review_id = 1`);

      expect(reviewAfterDeletion).toBeUndefined();

      expect(body).toEqual({});
    });
    test("Responds with status 400 if id is not a number", async () => {
      const { body } = await request(app)
        .delete("/api/reviews/abc")
        .expect(400);

      expect(body.msg).toBe("Review id should be a number!");
    });
    test("Responds with status 404 if review id is not exist", async () => {
      const { body } = await request(app)
        .delete("/api/reviews/999")
        .expect(404);
      expect(body.msg).toBe("Review not found!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "patch", "get", "post"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/reviews/1")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
    });
  });
  describe("GET api/users/:id", () => {
    test("Responds with status of 200", async () => {
      currentUser = { id: 1, email: "userA@example.com" };
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

      expect(body.msg).toBe("User value should be a number!");
    });
    test("Responds with status 404 if user not exist", async () => {
      const { body } = await request(app).get("/api/users/100000").expect(404);

      expect(body.msg).toBe("User not found!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "post", "delete"];
      methods.forEach(async (method) => {
        const { body } = await request(app)[method]("/api/users/1").expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
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
      const testUser = {
        first_name: "David",
        surname: "Aley",
        email: "example@example.com",
        phone: "+44 07123456",
        avatar: "https://e.com/images/j.jpg",
      };

      const { body } = await request(app).patch("/api/users/1").send(testUser);

      expect(body.user).toHaveProperty("user_id", 1);
      expect(body.user).toHaveProperty("first_name", "David");
      expect(body.user).toHaveProperty("surname", "Aley");
      expect(body.user).toHaveProperty("email", "example@example.com");
      expect(body.user).toHaveProperty("phone", "+44 07123456");
      expect(body.user).toHaveProperty("avatar", "https://e.com/images/j.jpg");
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
    test("Responds with 404 if user id is not exist", async () => {
      const { body } = await request(app).patch("/api/users/99999").expect(404);

      expect(body.msg).toBe("User not found!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "delete", "post"];
      methods.forEach(async (method) => {
        const { body } = await request(app)[method]("/api/users/1").expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
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
    test("Should respond with favourite id", async () => {
      const testReview = { guest_id: 1 };

      const { body } = await request(app)
        .post("/api/properties/1/favourite")
        .send(testReview);

      expect(body).toHaveProperty("favorite_id", 16);
    });
    test("Should also respond with success message with status of 201", async () => {
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
    test("Responds with status of 400 if property id is not a number", async () => {
      const { body } = await request(app)
        .post("/api/properties/abc/favourite")
        .send({ guest_id: 1 })
        .expect(400);

      expect(body.msg).toBe("Property id should be number!");
    });
    test("Responds with status of 404 if guest_id is not exist", async () => {
      const { body } = await request(app)
        .post("/api/properties/1/favourite")
        .send({ guest_id: 999999 })
        .expect(404);

      expect(body.msg).toBe("User not found!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "delete", "get", "patch"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/properties/1/favourite")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
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

      expect(body.msg).toBe("Property value should be a number!");
    });
    test("Responds with status 400 if user_id is not a number", async () => {
      const { body } = await request(app)
        .delete("/api/properties/1/users/abc/favourite")
        .expect(400);

      expect(body.msg).toBe("User value should be a number!");
    });
    test("Responds with status 404 if property_id is not exist", async () => {
      const { body } = await request(app)
        .delete("/api/properties/9999/users/6/favourite")
        .expect(404);

      expect(body.msg).toBe("Property not found!");
    });
    test("Responds with status 404 if user_id is not exist", async () => {
      const { body } = await request(app)
        .delete("/api/properties/1/users/99999/favourite")
        .expect(404);

      expect(body.msg).toBe("User not found!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "post", "get", "patch"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/properties/1/users/6/favourite")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
    });
  });
  describe("GET api/users/:id/favourites", () => {
    test("Responds with status 200", async () => {
      currentUser = { id: 1, email: "userA@example.com" };
      await request(app).get("/api/users/1/favourites").expect(200);
    });

    test("Responds with an object with correct keys", async () => {
      const { body } = await request(app).get("/api/users/1/favourites");
      expect(typeof body).toBe("object");
      expect(body).toHaveProperty("favourites");
    });

    test("Favourites responds with an array on the key of property", async () => {
      const { body } = await request(app).get("/api/users/1/favourites");
      expect(Array.isArray(body.favourites)).toBe(true);
    });

    test("Favourites property should have correct shape", async () => {
      const { body } = await request(app).get("/api/users/1/favourites");

      body.favourites.forEach((fav) => {
        expect(typeof fav.favourite_id).toBe("number");
        expect(typeof fav.property_id).toBe("number");
        expect(typeof fav.property_name).toBe("string");
        expect(typeof fav.host).toBe("string");
        expect(typeof fav.image).toBe("string");
      });
    });

    test("Favourites should order by favourite_id ascending", async () => {
      const { body } = await request(app).get("/api/users/1/favourites");
      expect(body.favourites).toBeSortedBy("favourite_id");
    });

    test("Responds with empty array and status 200 if user has no favourites", async () => {
      const { body } = await request(app).get("/api/users/1/favourites");
      expect(Array.isArray(body.favourites)).toBe(true);
    });

    test("Responds with status 400 if user_id is not a number", async () => {
      const { body } = await request(app)
        .get("/api/users/abc/favourites")
        .expect(400);

      expect(body.msg).toBe("User value should be a number!");
    });

    test("Responds with status 404 if user_id does not exist", async () => {
      const { body } = await request(app)
        .get("/api/users/99999/favourites")
        .expect(404);

      expect(body.msg).toBe("User not found!");
    });

    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "delete", "post", "patch"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/users/1/favourites")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
    });
  });

  describe("GET api/amenities", () => {
    test("Responds with status of 200", async () => {
      await request(app).get("/api/amenities").expect(200);
    });
    test("Responds with an array on the key of amenities", async () => {
      const { body } = await request(app).get("/api/amenities");

      expect(Array.isArray(body.amenities)).toBe(true);
    });
    test("Each property in the array should be an object", async () => {
      const { body } = await request(app).get("/api/amenities");

      body.amenities.forEach((amenity) =>
        expect(typeof amenity).toBe("object")
      );
    });
    test("Every single property should has correct shape", async () => {
      const { body } = await request(app).get("/api/amenities");

      body.amenities.forEach((amenity) => {
        expect(amenity).toHaveProperty("amenity_slug");
        expect(amenity).toHaveProperty("amenity_text");
      });
    });
    test("Should return the correct number of properties", async () => {
      const { body } = await request(app).get("/api/amenities");

      expect(body.amenities.length).toBe(5);
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "post", "delete", "patch"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/amenities")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
    });
  });
  describe("GET api/properties/:id/bookings", () => {
    test("Responds with status of 200", async () => {
      currentUser = { id: 2, email: "userA@example.com" };

      await request(app).get("/api/properties/1/bookings").expect(200);
    });
    test("Responds with an object with correct keys", async () => {
      const { body } = await request(app).get("/api/properties/1/bookings");

      expect(typeof body).toBe("object");
      expect(body).toHaveProperty("bookings");
      expect(body).toHaveProperty("property_id");
    });
    test("Bookings responds with an array on the key of property", async () => {
      const { body } = await request(app).get("/api/properties/1/bookings");
      expect(Array.isArray(body.bookings)).toBe(true);
    });
    test("Bookings property should has correct shape", async () => {
      const { body } = await request(app).get("/api/properties/1/bookings");

      // expect(body.bookings.length).toBeGreaterThan(0);

      body.bookings.forEach((booking) => {
        expect(typeof booking.booking_id).toBe("number");
        expect(typeof booking.check_in_date).toBe("string");
        expect(typeof booking.check_out_date).toBe("string");
        expect(typeof booking.created_at).toBe("string");
      });
    });
    test("Bookings should order by latest check out date to earliest", async () => {
      const { body } = await request(app).get("/api/properties/1/bookings");

      expect(body.bookings).toBeSortedBy("check_out_date", {
        descending: true,
      });
    });
    test("Responds with the correct property id", async () => {
      const { body } = await request(app).get("/api/properties/1/bookings");

      expect(body.property_id).toBe(1);
    });
    test("Responds with empty array and status 200 if there is no booking on property", async () => {
      await request(app).get("/api/properties/2/bookings").expect(200);
    });
    test("Responds with status 400 if property_id is not a number", async () => {
      const { body } = await request(app)
        .get("/api/properties/abc/bookings")
        .expect(400);

      expect(body.msg).toBe("Property value should be a number!");
    });
    test("Responds with status 404 if property_id is not exist", async () => {
      const { body } = await request(app)
        .get("/api/properties/99999/bookings")
        .expect(404);

      expect(body.msg).toBe("Property not found!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "post", "delete", "patch"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/properties/1/bookings")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
    });
  });
  describe("POST api/properties/:id/booking", () => {
    test("Responds with status 201", async () => {
      currentUser = { id: 2, email: "userA@example.com" };

      const testBooking = {
        guest_id: 2,
        check_in_date: "2026-12-01T00:00:00.000Z",
        check_out_date: "2026-12-05T00:00:00.000Z",
      };
      await request(app)
        .post("/api/properties/1/booking")
        .send(testBooking)
        .expect(201);
    });
    test("Should respond with booking id", async () => {
      const testBooking = {
        guest_id: 2,
        check_in_date: "2026-12-01T00:00:00.000Z",
        check_out_date: "2026-12-05T00:00:00.000Z",
      };
      const { body } = await request(app)
        .post("/api/properties/1/booking")
        .send(testBooking)
        .expect(201);
      expect(body).toHaveProperty("booking_id");
    });
    test("Should also respond with success message with status of 201", async () => {
      const testBooking = {
        guest_id: 2,
        check_in_date: "2026-12-01T00:00:00.000Z",
        check_out_date: "2026-12-05T00:00:00.000Z",
      };
      const { body } = await request(app)
        .post("/api/properties/1/booking")
        .send(testBooking)
        .expect(201);
      expect(body.msg).toBe("Booking successful");
    });
    test("Responds with status of 400 if property id is not a number", async () => {
      const testBooking = {
        guest_id: 2,
        check_in_date: "2026-12-01T00:00:00.000Z",
        check_out_date: "2026-12-05T00:00:00.000Z",
      };

      const { body } = await request(app)
        .post("/api/properties/abc/booking")
        .send(testBooking)
        .expect(400);

      expect(body.msg).toBe("Property id should be number!");
    });
    test("Responds with status of 400 if guest_id is not provided", async () => {
      const testBooking = {
        check_in_date: "2026-12-01T00:00:00.000Z",
        check_out_date: "2026-12-05T00:00:00.000Z",
      };

      const { body } = await request(app)
        .post("/api/properties/1/booking")
        .send(testBooking)
        .expect(400);

      expect(body.msg).toBe("Guest id should be provided!");
    });
    test("Responds with status of 400 if guest_id is not a number", async () => {
      const testBooking = {
        guest_id: "abc",
        check_in_date: "2026-12-01T00:00:00.000Z",
        check_out_date: "2026-12-05T00:00:00.000Z",
      };

      const { body } = await request(app)
        .post("/api/properties/1/booking")
        .send(testBooking)
        .expect(400);

      expect(body.msg).toBe("Guest id should be number!");
    });
    test("Responds with status of 400 if check_in_date is not provided", async () => {
      const testBooking = {
        guest_id: 2,
        check_out_date: "2026-12-05T00:00:00.000Z",
      };

      const { body } = await request(app)
        .post("/api/properties/1/booking")
        .send(testBooking)
        .expect(400);

      expect(body.msg).toBe("Check in date should be provided!");
    });
    test("Responds with status of 400 if check_out_date is not provided", async () => {
      const testBooking = {
        guest_id: 2,
        check_in_date: "2026-12-01T00:00:00.000Z",
      };

      const { body } = await request(app)
        .post("/api/properties/1/booking")
        .send(testBooking)
        .expect(400);

      expect(body.msg).toBe("Check out date should be provided!");
    });
    test("Responds with status of 400 if there is a clashing booking", async () => {
      const testBooking = {
        guest_id: 2,
        check_in_date: "2025-12-01T00:00:00.000Z",
        check_out_date: "2025-12-05T00:00:00.000Z",
      };

      const { body } = await request(app)
        .post("/api/properties/1/booking")
        .send(testBooking)
        .expect(400);

      expect(body.msg).toBe("Booking clash with an existing booking!");
    });
    test("Responds with status of 404 if guest_id is not exist", async () => {
      const testBooking = {
        guest_id: 999999,
        check_in_date: "2026-12-01T00:00:00.000Z",
        check_out_date: "2026-12-05T00:00:00.000Z",
      };

      const { body } = await request(app)
        .post("/api/properties/1/booking")
        .send(testBooking)
        .expect(404);

      expect(body.msg).toBe("User not found!");
    });
    test("Responds with status of 404 if property id is not exist", async () => {
      const testBooking = {
        guest_id: 2,
        check_in_date: "2026-12-01T00:00:00.000Z",
        check_out_date: "2026-12-05T00:00:00.000Z",
      };

      const { body } = await request(app)
        .post("/api/properties/9999999/booking")
        .send(testBooking)
        .expect(404);

      expect(body.msg).toBe("Property not found!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "get", "delete", "patch"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/properties/1/booking")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
    });
  });
  describe("DELETE api/bookings/:id", () => {
    test("Responds with status of 204", async () => {
      await request(app).delete("/api/bookings/1").expect(204);
    });
    test("Should delete booking and respond with empty object", async () => {
      currentUser = { id: 2, email: "userA@example.com" };

      const {
        rows: [bookingBeforeDeletion],
      } = await db.query(
        `SELECT * FROM bookings WHERE booking_id = 1 AND guest_id = 2`
      );

      expect(bookingBeforeDeletion).toBeDefined();

      const { body } = await request(app).delete("/api/bookings/1").expect(204);

      const {
        rows: [bookingAfterDeletion],
      } = await db.query(
        `SELECT * FROM bookings WHERE booking_id = 1 AND guest_id = 2`
      );

      expect(bookingAfterDeletion).toBeUndefined();

      expect(body).toEqual({});
    });
    test("Responds with status 400 if id is not a number", async () => {
      const { body } = await request(app)
        .delete("/api/bookings/abc")
        .expect(400);

      expect(body.msg).toBe("Invalid booking value!");
    });
    test("Responds with status 404 if booking id is not exist", async () => {
      const { body } = await request(app)
        .delete("/api/bookings/999")
        .expect(404);
      expect(body.msg).toBe("Booking not found!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "get", "post"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/bookings/1")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
    });
  });
  describe("PATCH api/bookings/:id", () => {
    test("Respond with status of 200", async () => {
      await request(app)
        .patch("/api/bookings/1")
        .send({ check_in_date: "2025-12-02T00:00:00.000Z" })
        .expect(200);
    });
    test("Should update single passed field", async () => {
      const testBooking = { check_in_date: "2025-12-01T00:00:00.000Z" };
      const { body } = await request(app)
        .patch("/api/bookings/1")
        .send(testBooking);

      expect(body.booking).toHaveProperty(
        "check_in_date",
        "2025-12-01T00:00:00.000Z"
      );
    });
    test("Should update all passed field", async () => {
      const testBooking = {
        check_in_date: "2025-12-01T00:00:00.000Z",
        check_out_date: "2025-12-05T00:00:00.000Z",
      };
      const { body } = await request(app)
        .patch("/api/bookings/1")
        .send(testBooking);

      expect(body.booking).toHaveProperty(
        "check_in_date",
        "2025-12-01T00:00:00.000Z"
      );
      expect(body.booking).toHaveProperty(
        "check_out_date",
        "2025-12-05T00:00:00.000Z"
      );
    });
    test("Should respond all booking properties with updated fields", async () => {
      const testBooking = {
        check_in_date: "2025-12-01T00:00:00.000Z",
        check_out_date: "2025-12-05T00:00:00.000Z",
      };
      const { body } = await request(app)
        .patch("/api/bookings/1")
        .send(testBooking);

      expect(body.booking).toHaveProperty("booking_id", 1);
      expect(body.booking).toHaveProperty("property_id", 1);
      expect(body.booking).toHaveProperty("guest_id", 2);
      expect(body.booking).toHaveProperty(
        "check_in_date",
        "2025-12-01T00:00:00.000Z"
      );
      expect(body.booking).toHaveProperty(
        "check_out_date",
        "2025-12-05T00:00:00.000Z"
      );
      expect(body.booking).toHaveProperty("created_at");
    });
    test("Responds with 400 if passed field is invalid", async () => {
      const testUser = { fdsfsdf: "fsdfsddfs" };
      const { body } = await request(app)
        .patch("/api/bookings/1")
        .send(testUser)
        .expect(400);

      expect(body.msg).toBe("Invalid field!");
    });
    test("Responds with 404 if user id is not exist", async () => {
      const { body } = await request(app)
        .patch("/api/bookings/99999")
        .expect(404);

      expect(body.msg).toBe("Booking not found!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "get", "post"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/bookings/1")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
    });
  });
  describe("GET api/users/:id/bookings", () => {
    test("Responds with status of 200", async () => {
      currentUser = { id: 1, email: "userA@example.com" };
      await request(app).get("/api/users/1/bookings").expect(200);
    });
    test("Responds with an object with correct keys", async () => {
      const { body } = await request(app).get("/api/users/1/bookings");
      expect(typeof body).toBe("object");
      expect(body).toHaveProperty("bookings");
    });
    test("Bookings responds with an array on the key of property", async () => {
      const { body } = await request(app).get("/api/users/1/bookings");
      expect(Array.isArray(body.bookings)).toBe(true);
    });
    test("Bookings property should has correct shape", async () => {
      const { body } = await request(app).get("/api/users/1/bookings");

      // expect(body.bookings.length).toBeGreaterThan(0);

      body.bookings.forEach((booking) => {
        expect(typeof booking.booking_id).toBe("number");
        expect(typeof booking.check_in_date).toBe("string");
        expect(typeof booking.check_out_date).toBe("string");
        expect(typeof booking.property_id).toBe("number");
        expect(typeof booking.property_name).toBe("string");
        expect(typeof booking.host).toBe("string");
        expect(typeof booking.image).toBe("string");
      });
    });
    test("Bookings should order by chronological oldest check in date to newest", async () => {
      const { body } = await request(app).get("/api/users/1/bookings");

      expect(body.bookings).toBeSortedBy("check_in_date");
    });
    test("Responds with empty array and status 200 if user has no bookings", async () => {
      await request(app).get("/api/users/1/bookings").expect(200);
    });
    test("Responds with status 400 if user_id is not a number", async () => {
      const { body } = await request(app)
        .get("/api/users/abc/bookings")
        .expect(400);

      expect(body.msg).toBe("User value should be a number!");
    });
    test("Responds with status 404 if user_id is not exist", async () => {
      const { body } = await request(app)
        .get("/api/users/99999/bookings")
        .expect(404);

      expect(body.msg).toBe("User not found!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "delete", "post", "patch"];
      methods.forEach(async (method) => {
        const { body } = await request(app)
          [method]("/api/users/1/bookings")
          .expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
    });
  });
  describe("POST /singup", () => {
    test("Responds with status of 201", async () => {
      const testUser = {
        first_name: "Alice",
        surname: "Aley",
        email: "g@g.com",
        is_host: false,
        password: "12345",
      };

      await request(app).post("/signup").send(testUser).expect(201);
    });
    test("Should respond with new token", async () => {
      const testUser = {
        first_name: "Alice",
        surname: "Aley",
        email: "g@g.com",
        is_host: false,
        password: "12345",
      };

      const { body } = await request(app)
        .post("/signup")
        .send(testUser)
        .expect(201);

      expect(body).toEqual({ token: expect.anything() });
    });
    test("Responds with status of 400 if first_name is not provided", async () => {
      const testUser = {
        surname: "Aley",
        email: "g@g.com",
        is_host: false,
        password: "12345",
      };

      const { body } = await request(app)
        .post("/signup")
        .send(testUser)
        .expect(400);

      expect(body.msg).toBe("First name should be provided!");
    });
    test("Responds with status of 400 if surname is not provided", async () => {
      const testUser = {
        first_name: "Alice",
        email: "g@g.com",
        is_host: false,
        password: "12345",
      };

      const { body } = await request(app)
        .post("/signup")
        .send(testUser)
        .expect(400);

      expect(body.msg).toBe("Surname should be provided!");
    });
    test("Responds with status of 400 if email is not provided", async () => {
      const testUser = {
        first_name: "Alice",
        surname: "Aley",
        is_host: false,
        password: "12345",
      };

      const { body } = await request(app)
        .post("/signup")
        .send(testUser)
        .expect(400);

      expect(body.msg).toBe("Email should be provided!");
    });
    test("Responds with status of 400 if password is not provided", async () => {
      const testUser = {
        first_name: "Alice",
        surname: "Aley",
        email: "g@g.com",
        is_host: false,
      };

      const { body } = await request(app)
        .post("/signup")
        .send(testUser)
        .expect(400);

      expect(body.msg).toBe("Password should be provided!");
    });
    test("Responds with status 405 for invalid methods", async () => {
      const methods = ["put", "patch", "delete", "get"];
      methods.forEach(async (method) => {
        const { body } = await request(app)[method]("/signup").expect(405);

        expect(body.msg).toBe("Invalid method!");
      });
    });
  });
  describe("POST /login", () => {
    test("Responds with status of 201", async () => {
      hashedPassword = bcrypt.hashSync("12345", 10);

      await insertSignup("Alice", "Aley", "g@g.com", false, hashedPassword);

      const testUser = {
        email: "g@g.com",
        password: "12345",
      };

      await request(app).post("/login").send(testUser).expect(201);
    });
    test("Responds with new token", async () => {
      hashedPassword = bcrypt.hashSync("12345", 10);

      await insertSignup("Alice", "Aley", "g@g.com", false, hashedPassword);

      const testUser = {
        email: "g@g.com",
        password: "12345",
      };

      const { body } = await request(app)
        .post("/login")
        .send(testUser)
        .expect(201);

      expect(body).toEqual({ token: expect.anything() });
    });
    test("Responds with status of 400 if email is not provided", async () => {
      hashedPassword = bcrypt.hashSync("12345", 10);

      await insertSignup("Alice", "Aley", "g@g.com", false, hashedPassword);

      const testUser = {
        password: "12345",
      };

      const { body } = await request(app)
        .post("/login")
        .send(testUser)
        .expect(400);

      expect(body.msg).toBe("Email should be provided!");
    });
    test("Responds with status of 400 if password is not provided", async () => {
      hashedPassword = bcrypt.hashSync("12345", 10);

      await insertSignup("Alice", "Aley", "g@g.com", false, hashedPassword);

      const testUser = {
        email: "g@g.com",
      };

      const { body } = await request(app)
        .post("/login")
        .send(testUser)
        .expect(400);

      expect(body.msg).toBe("Password should be provided!");
    });
    test("Responds with status of 401 if password is not matched", async () => {
      hashedPassword = bcrypt.hashSync("12345", 10);

      await insertSignup("Alice", "Aley", "g@g.com", false, hashedPassword);

      const testUser = {
        email: "g@g.com",
        password: "123456",
      };

      const { body } = await request(app)
        .post("/login")
        .send(testUser)
        .expect(401);

      expect(body.msg).toBe("Incorrect credentials!");
    });
  });
});
