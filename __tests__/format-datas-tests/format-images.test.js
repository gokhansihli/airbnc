const { formatImages } = require("../../db/utils/format-datas");

describe("formatImages", () => {
  test("Returns a new array", () => {
    const propertiesData = [
      { property_id: 1, name: "Modern Apartment in City Center" },
    ];
    const imagesData = [
      {
        property_name: "Modern Apartment in City Center",
        image_url: "https://example.com/images/modern_apartment_1.jpg",
        alt_tag: "Alt tag for Modern Apartment in City Center",
      },
    ];
    const result = formatImages(imagesData, propertiesData);
    expect(Array.isArray(result)).toBe(true);
    expect(result).not.toBe(imagesData);
  });

  test("Returns an empty array when given empty arrays", () => {
    const result = formatImages([], []);
    expect(result).toEqual([]);
  });

  test("Formats a single image object correctly", () => {
    const propertiesData = [
      { property_id: 1, name: "Modern Apartment in City Center" },
    ];
    const imagesData = [
      {
        property_name: "Modern Apartment in City Center",
        image_url: "https://example.com/images/modern_apartment_1.jpg",
        alt_tag: "Alt tag for Modern Apartment in City Center",
      },
    ];
    const result = formatImages(imagesData, propertiesData);
    expect(result).toEqual([
      [
        1,
        "https://example.com/images/modern_apartment_1.jpg",
        "Alt tag for Modern Apartment in City Center",
      ],
    ]);
  });

  test("Formats multiple image objects correctly", () => {
    const propertiesData = [
      { property_id: 1, name: "Modern Apartment in City Center" },
      { property_id: 2, name: "Cosy Family House" },
    ];
    const imagesData = [
      {
        property_name: "Modern Apartment in City Center",
        image_url: "https://example.com/images/modern_apartment_1.jpg",
        alt_tag: "Alt tag for Modern Apartment in City Center",
      },
      {
        property_name: "Cosy Family House",
        image_url: "https://example.com/images/cosy_family_house_1.jpg",
        alt_tag: "Alt tag for Cosy Family House",
      },
    ];
    const result = formatImages(imagesData, propertiesData);
    expect(result).toEqual([
      [
        1,
        "https://example.com/images/modern_apartment_1.jpg",
        "Alt tag for Modern Apartment in City Center",
      ],
      [
        2,
        "https://example.com/images/cosy_family_house_1.jpg",
        "Alt tag for Cosy Family House",
      ],
    ]);
  });
});
