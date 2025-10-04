const { formatProperties } = require("../../db/utils/format-datas");

describe("formatProperties", () => {
  test("Returns a new array", () => {
    const usersData = [{ user_id: 1, first_name: "Alice", surname: "Johnson" }];
    const propertiesData = [
      {
        name: "Modern Apartment in City Center",
        property_type: "Apartment",
        location: "London, UK",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center.",
        host_name: "Alice Johnson",
        amenities: ["WiFi", "TV", "Kitchen"],
      },
    ];
    const result = formatProperties(propertiesData, usersData);
    expect(Array.isArray(result)).toBe(true);
    expect(result).not.toBe(propertiesData);
  });

  test("Returns an empty array when given an empty array", () => {
    const result = formatProperties([], []);
    expect(result).toEqual([]);
  });

  test("Formats a single property object correctly", () => {
    const usersData = [{ user_id: 1, first_name: "Alice", surname: "Johnson" }];
    const propertiesData = [
      {
        name: "Modern Apartment in City Center",
        property_type: "Apartment",
        location: "London, UK",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center.",
        host_name: "Alice Johnson",
        amenities: ["WiFi", "TV", "Kitchen"],
      },
    ];
    const result = formatProperties(propertiesData, usersData);
    expect(result).toEqual([
      [
        1,
        "Modern Apartment in City Center",
        "London, UK",
        "Apartment",
        120.0,
        "Description of Modern Apartment in City Center.",
      ],
    ]);
  });

  test("Formats multiple property objects correctly", () => {
    const usersData = [
      { user_id: 1, first_name: "Alice", surname: "Johnson" },
      { user_id: 2, first_name: "Bob", surname: "Smith" },
    ];
    const propertiesData = [
      {
        name: "Modern Apartment in City Center",
        property_type: "Apartment",
        location: "London, UK",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center.",
        host_name: "Alice Johnson",
        amenities: ["WiFi", "TV", "Kitchen"],
      },
      {
        name: "Cosy Family House",
        property_type: "House",
        location: "Manchester, UK",
        price_per_night: 150.0,
        description: "Description of Cosy Family House.",
        host_name: "Bob Smith",
        amenities: ["WiFi", "Parking", "Kitchen"],
      },
    ];
    const result = formatProperties(propertiesData, usersData);
    expect(result).toEqual([
      [
        1,
        "Modern Apartment in City Center",
        "London, UK",
        "Apartment",
        120.0,
        "Description of Modern Apartment in City Center.",
      ],
      [
        2,
        "Cosy Family House",
        "Manchester, UK",
        "House",
        150.0,
        "Description of Cosy Family House.",
      ],
    ]);
  });
});
