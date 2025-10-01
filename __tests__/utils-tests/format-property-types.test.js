const formatPropertyTypes = require("../../db/utils/format-property-types");

describe("formatPropertyTypes", () => {
  test("Returns a new array", () => {
    const input = [
      { property_type: "Apartment", description: "Description of Apartment." },
    ];
    const result = formatPropertyTypes(input);
    expect(result).not.toBe(input);
  });
  test("Returns an empty array when given an empty array", () => {
    const result = formatPropertyTypes([]);
    expect(result).toEqual([]);
  });
  test("Formats a single property type correctly", () => {
    const input = [
      { property_type: "Apartment", description: "Description of Apartment." },
    ];
    const result = formatPropertyTypes(input);
    expect(result).toEqual([["Apartment", "Description of Apartment."]]);
  });

  test("Formats multiple property types correctly", () => {
    const input = [
      { property_type: "Apartment", description: "Description of Apartment." },
      { property_type: "House", description: "Description of House." },
      { property_type: "Studio", description: "Description of Studio." },
    ];
    const result = formatPropertyTypes(input);
    expect(result).toEqual([
      ["Apartment", "Description of Apartment."],
      ["House", "Description of House."],
      ["Studio", "Description of Studio."],
    ]);
  });
});
