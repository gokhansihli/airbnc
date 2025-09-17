const formatReviews = require("../format-reviews");

describe("formatReviews", () => {
  test("Returns a new array", () => {
    const usersData = [{ user_id: 1, first_name: "Frank", surname: "White" }];
    const propertiesData = [
      { property_id: 1, name: "Chic Studio Near the Beach" },
    ];
    const reviewsData = [
      {
        guest_name: "Frank White",
        property_name: "Chic Studio Near the Beach",
        rating: 4,
        comment: "Comment about Chic Studio Near the Beach",
        created_at: "2024-03-28T10:15:00Z",
      },
    ];
    const result = formatReviews(reviewsData, usersData, propertiesData);
    expect(Array.isArray(result)).toBe(true);
    expect(result).not.toBe(reviewsData);
  });

  test("Returns an empty array when given empty arrays", () => {
    const result = formatReviews([], [], []);
    expect(result).toEqual([]);
  });

  test("Formats a single review object correctly", () => {
    const usersData = [{ user_id: 1, first_name: "Frank", surname: "White" }];
    const propertiesData = [
      { property_id: 1, name: "Chic Studio Near the Beach" },
    ];
    const reviewsData = [
      {
        guest_name: "Frank White",
        property_name: "Chic Studio Near the Beach",
        rating: 4,
        comment: "Comment about Chic Studio Near the Beach",
        created_at: "2024-03-28T10:15:00Z",
      },
    ];
    const result = formatReviews(reviewsData, usersData, propertiesData);
    expect(result).toEqual([
      [
        1,
        1,
        4,
        "Comment about Chic Studio Near the Beach",
        "2024-03-28T10:15:00Z",
      ],
    ]);
  });

  test("Formats multiple review objects correctly", () => {
    const usersData = [
      { user_id: 1, first_name: "Frank", surname: "White" },
      { user_id: 2, first_name: "Bob", surname: "Smith" },
    ];
    const propertiesData = [
      { property_id: 1, name: "Chic Studio Near the Beach" },
      { property_id: 2, name: "Modern Apartment in City Center" },
    ];
    const reviewsData = [
      {
        guest_name: "Frank White",
        property_name: "Chic Studio Near the Beach",
        rating: 4,
        comment: "Comment about Chic Studio Near the Beach",
        created_at: "2024-03-28T10:15:00Z",
      },
      {
        guest_name: "Bob Smith",
        property_name: "Modern Apartment in City Center",
        rating: 2,
        comment: "Comment about Modern Apartment in City Center",
        created_at: "2024-04-12T14:45:00Z",
      },
    ];
    const result = formatReviews(reviewsData, usersData, propertiesData);
    expect(result).toEqual([
      [
        1,
        1,
        4,
        "Comment about Chic Studio Near the Beach",
        "2024-03-28T10:15:00Z",
      ],
      [
        2,
        2,
        2,
        "Comment about Modern Apartment in City Center",
        "2024-04-12T14:45:00Z",
      ],
    ]);
  });
});
