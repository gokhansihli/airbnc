const { createAmenities } = require("../../db/utils/format-datas");

describe("createAmenities", () => {
  test("Returns an array", () => {
    const result = createAmenities([]);
    expect(typeof result).toBe("object");
    expect(Array.isArray(createAmenities([]))).toBe(true);
  });
  test("Returns an empty array when passed an empty array", () => {
    const result = createAmenities([]);

    expect(result).toEqual([]);
  });
  test("Formats a single amenities property object correctly", () => {
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
    const result = createAmenities(propertiesData);
    expect(result).toEqual([["WiFi"], ["TV"], ["Kitchen"]]);
  });
  test("Formats multiple amenities property object correctly", () => {
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
        host_name: "Alice Johnson",
        amenities: ["WiFi", "Parking", "Kitchen"],
      },
    ];
    const result = createAmenities(propertiesData);
    expect(result).toEqual([["WiFi"], ["TV"], ["Kitchen"], ["Parking"]]);
  });
});
