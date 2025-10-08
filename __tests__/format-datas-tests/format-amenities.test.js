const { formatAmenities } = require("../../db/utils/format-datas");

describe("formatAmenities", () => {
  test("Returns an array", () => {
    const result = formatAmenities([]);
    expect(typeof result).toBe("object");
    expect(Array.isArray(formatAmenities([]))).toBe(true);
  });
  test("Returns an empty array when passed an empty array", () => {
    const result = formatAmenities([]);

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
    const result = formatAmenities(propertiesData);
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
    const result = formatAmenities(propertiesData);
    expect(result).toEqual([["WiFi"], ["TV"], ["Kitchen"], ["Parking"]]);
  });
});
