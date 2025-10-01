const formatFavourites = require("../../db/utils/format-favourites");

describe("formatFavourites", () => {
  test("Returns a new array", () => {
    const usersData = [
      { user_id: 1, first_name: "Rachel", surname: "Cummings" },
    ];

    const propertiesData = [
      { property_id: 1, name: "Modern Apartment in City Center" },
    ];

    const favouritesData = [
      {
        guest_name: "Rachel Cummings",
        property_name: "Modern Apartment in City Center",
      },
    ];

    const result = formatFavourites(favouritesData, usersData, propertiesData);
    expect(Array.isArray(result)).toBe(true);
    expect(result).not.toBe(favouritesData);
  });

  test("Returns an empty array when given empty arrays", () => {
    const result = formatFavourites([], [], []);
    expect(result).toEqual([]);
  });

  test("Formats a single favourite correctly", () => {
    const usersData = [
      { user_id: 1, first_name: "Rachel", surname: "Cummings" },
    ];
    const propertiesData = [
      { property_id: 1, name: "Modern Apartment in City Center" },
    ];
    const favouritesData = [
      {
        guest_name: "Rachel Cummings",
        property_name: "Modern Apartment in City Center",
      },
    ];
    const result = formatFavourites(favouritesData, usersData, propertiesData);
    expect(result).toEqual([[1, 1]]);
  });

  test("Formats multiple favourites correctly", () => {
    const usersData = [
      { user_id: 1, first_name: "Rachel", surname: "Cummings" },
      { user_id: 2, first_name: "Frank", surname: "White" },
    ];

    const propertiesData = [
      { property_id: 1, name: "Modern Apartment in City Center" },
      { property_id: 2, name: "Luxury Penthouse with View" },
    ];

    const favouritesData = [
      {
        guest_name: "Rachel Cummings",
        property_name: "Modern Apartment in City Center",
      },
      {
        guest_name: "Frank White",
        property_name: "Luxury Penthouse with View",
      },
    ];

    const result = formatFavourites(favouritesData, usersData, propertiesData);
    expect(result).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });
});
