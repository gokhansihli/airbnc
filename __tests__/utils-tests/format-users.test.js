const formatUsers = require("../../db/utils/format-users");

describe("formatUsers", () => {
  test("Returns a new array", () => {
    const input = [
      {
        first_name: "Alice",
        surname: "Johnson",
        email: "alice@example.com",
        phone_number: "+44 7000 111111",
        is_host: true,
        avatar: "https://example.com/images/alice.jpg",
      },
    ];
    const result = formatUsers(input);

    expect(result).not.toBe(input);
  });
  test("Returns an empty array when given an empty array", () => {
    const input = [];
    const result = formatUsers(input);
    expect(result).toEqual([]);
  });
  test("Formats a single user object correctly", () => {
    const input = [
      {
        first_name: "Alice",
        surname: "Johnson",
        email: "alice@example.com",
        phone_number: "+44 7000 111111",
        is_host: true,
        avatar: "https://example.com/images/alice.jpg",
      },
    ];
    const result = formatUsers(input);

    expect(result).toEqual([
      [
        "Alice",
        "Johnson",
        "alice@example.com",
        "+44 7000 111111",
        true,
        "https://example.com/images/alice.jpg",
      ],
    ]);
  });
  test("Formats multiple user objects correctly", () => {
    const input = [
      {
        first_name: "Alice",
        surname: "Johnson",
        email: "alice@example.com",
        phone_number: "+44 7000 111111",
        is_host: true,
        avatar: "https://example.com/images/alice.jpg",
      },
      {
        first_name: "Bob",
        surname: "Smith",
        email: "bob@example.com",
        phone_number: "+44 7000 222222",
        is_host: false,
        avatar: "https://example.com/images/bob.jpg",
      },
    ];
    const result = formatUsers(input);

    expect(result).toEqual([
      [
        "Alice",
        "Johnson",
        "alice@example.com",
        "+44 7000 111111",
        true,
        "https://example.com/images/alice.jpg",
      ],
      [
        "Bob",
        "Smith",
        "bob@example.com",
        "+44 7000 222222",
        false,
        "https://example.com/images/bob.jpg",
      ],
    ]);
  });
});
