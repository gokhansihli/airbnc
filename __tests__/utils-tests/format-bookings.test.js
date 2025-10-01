const formatBookings = require("../../db/utils/format-bookings");

describe("formatBookings", () => {
  test("Returns a new array", () => {
    const usersData = [{ user_id: 1, first_name: "Bob", surname: "Smith" }];

    const propertiesData = [
      { property_id: 1, name: "Modern Apartment in City Center" },
    ];

    const bookingsData = [
      {
        property_name: "Modern Apartment in City Center",
        guest_name: "Bob Smith",
        check_in_date: "2025-12-01",
        check_out_date: "2025-12-05",
      },
    ];

    const result = formatBookings(bookingsData, usersData, propertiesData);
    expect(Array.isArray(result)).toBe(true);
    expect(result).not.toBe(bookingsData);
  });

  test("Returns an empty array when given empty arrays", () => {
    const result = formatBookings([], [], []);
    expect(result).toEqual([]);
  });

  test("Formats a single booking correctly", () => {
    const usersData = [{ user_id: 1, first_name: "Bob", surname: "Smith" }];
    const propertiesData = [
      { property_id: 1, name: "Modern Apartment in City Center" },
    ];
    const bookingsData = [
      {
        property_name: "Modern Apartment in City Center",
        guest_name: "Bob Smith",
        check_in_date: "2025-12-01",
        check_out_date: "2025-12-05",
      },
    ];

    const result = formatBookings(bookingsData, usersData, propertiesData);
    expect(result).toEqual([[1, 1, "2025-12-01", "2025-12-05"]]);
  });

  test("Formats multiple bookings correctly", () => {
    const usersData = [
      { user_id: 1, first_name: "Bob", surname: "Smith" },
      { user_id: 2, first_name: "Rachel", surname: "Cummings" },
    ];

    const propertiesData = [
      { property_id: 1, name: "Modern Apartment in City Center" },
      { property_id: 2, name: "Cosy Family House" },
    ];

    const bookingsData = [
      {
        property_name: "Modern Apartment in City Center",
        guest_name: "Bob Smith",
        check_in_date: "2025-12-01",
        check_out_date: "2025-12-05",
      },
      {
        property_name: "Cosy Family House",
        guest_name: "Rachel Cummings",
        check_in_date: "2025-12-10",
        check_out_date: "2025-12-15",
      },
    ];

    const result = formatBookings(bookingsData, usersData, propertiesData);
    expect(result).toEqual([
      [1, 1, "2025-12-01", "2025-12-05"],
      [2, 2, "2025-12-10", "2025-12-15"],
    ]);
  });
});
