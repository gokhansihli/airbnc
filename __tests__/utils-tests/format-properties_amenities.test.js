const formatPropertiesAmenities = require("../../db/utils/format-properties_amenities");

describe("formatPropertiesAmenities", () => {
  test("Returns a new array", () => {
    expect(formatPropertiesAmenities([])).toEqual([]);
  });
  test("Returns an empty array when given an empty array", () => {
    const result = formatPropertiesAmenities([], []);
    expect(result).toEqual([]);
  });
  test("Formats a single property object correctly", () => {
    const propertiesData = [
      {
        property_id: 1,
        name: "Modern Apartment in City Center",
        property_type: "Apartment",
        location: "London, UK",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center.",
        host_name: "Alice Johnson",
        amenities: ["WiFi", "TV", "Kitchen"],
      },
    ];
    const insertedProperties = [1];
    const result = formatPropertiesAmenities(
      propertiesData,
      insertedProperties
    );
    expect(result).toEqual([
      [1, "WiFi"],
      [1, "TV"],
      [1, "Kitchen"],
    ]);
  });
  test("Formats multiple property objects correctly", () => {
    const propertiesData = [
      {
        property_id: 1,
        name: "Modern Apartment in City Center",
        property_type: "Apartment",
        location: "London, UK",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center.",
        host_name: "Alice Johnson",
        amenities: ["WiFi", "TV", "Kitchen"],
      },
      {
        property_id: 2,
        name: "Cosy Family House",
        property_type: "House",
        location: "Manchester, UK",
        price_per_night: 150.0,
        description: "Description of Cosy Family House.",
        host_name: "Alice Johnson",
        amenities: ["WiFi", "Parking", "Kitchen"],
      },
    ];
    const insertedProperties = [1, 2];
    const result = formatPropertiesAmenities(
      propertiesData,
      insertedProperties
    );
    expect(result).toEqual([
      [1, "WiFi"],
      [1, "TV"],
      [1, "Kitchen"],
      [2, "WiFi"],
      [2, "Parking"],
      [2, "Kitchen"],
    ]);
  });
});
