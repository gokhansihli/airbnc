const createPropertiesRef = require("../../db/utils/properties-ref");

describe("createPropertiesRef", () => {
  test("Returns an object", () => {
    expect(typeof createPropertiesRef([])).toBe("object");
  });
  test("Returns an empty object when passed empty array", () => {
    expect(createPropertiesRef([])).toEqual({});
  });
  test("Assigns property name props as key on ref object", () => {
    const properties = [
      {
        property_id: 1,
        host_id: 1,
        name: "Modern Apartment in City Center",
        location: "London, UK",
        property_type: "Apartment",
        price_per_night: "120",
        description: "Description of Modern Apartment in City Center.",
      },
    ];

    const ref = createPropertiesRef(properties);
    expect(ref.hasOwnProperty("Modern Apartment in City Center")).toBe(true);
  });
  test("Assigns property id as value to property name", () => {
    const properties = [
      {
        property_id: 1,
        host_id: 1,
        name: "Modern Apartment in City Center",
        location: "London, UK",
        property_type: "Apartment",
        price_per_night: "120",
        description: "Description of Modern Apartment in City Center.",
      },
    ];

    const ref = createPropertiesRef(properties);
    expect(ref["Modern Apartment in City Center"]).toBe(1);
  });
  test("Assigns multiple key value pairs", () => {
    const properties = [
      {
        property_id: 1,
        host_id: 1,
        name: "Modern Apartment in City Center",
        location: "London, UK",
        property_type: "Apartment",
        price_per_night: "120",
        description: "Description of Modern Apartment in City Center.",
      },
      {
        property_id: 2,
        host_id: 1,
        name: "Cosy Family House",
        location: "Manchester, UK",
        property_type: "House",
        price_per_night: "150",
        description: "Description of Cosy Family House.",
      },
    ];

    const ref = createPropertiesRef(properties);
    expect(ref).toEqual({
      "Modern Apartment in City Center": 1,
      "Cosy Family House": 2,
    });
  });
});
