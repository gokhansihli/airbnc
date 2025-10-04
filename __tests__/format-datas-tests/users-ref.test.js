const { createUsersRef } = require("../../db/utils/format-datas");

describe("createUsersRef", () => {
  test("Returns an object", () => {
    expect(typeof createUsersRef([])).toBe("object");
  });
  test("Returns an empty object when passed empty array", () => {
    expect(createUsersRef([])).toEqual({});
  });
  test("Assigns first name and surname props as key on ref object", () => {
    const users = [
      {
        user_id: 1,
        first_name: "Alice",
        surname: "Johnson",
        email: "alice@example.com",
        phone_number: "+44 7000 111111",
        is_host: true,
        avatar: "https://example.com/images/alice.jpg",
        created_at: "2025-09-18T13:34:25.776Z",
      },
    ];

    const ref = createUsersRef(users);

    expect(ref.hasOwnProperty("Alice Johnson")).toBe(true);
  });
  test("Assigns user id as value to first name and surname props", () => {
    const users = [
      {
        user_id: 1,
        first_name: "Alice",
        surname: "Johnson",
        email: "alice@example.com",
        phone_number: "+44 7000 111111",
        is_host: true,
        avatar: "https://example.com/images/alice.jpg",
        created_at: "2025-09-18T13:34:25.776Z",
      },
    ];

    const ref = createUsersRef(users);

    expect(ref["Alice Johnson"]).toBe(1);
  });
  test("Assigns multiple key value pairs", () => {
    const users = [
      {
        user_id: 1,
        first_name: "Alice",
        surname: "Johnson",
        email: "alice@example.com",
        phone_number: "+44 7000 111111",
        is_host: true,
        avatar: "https://example.com/images/alice.jpg",
        created_at: "2025-09-18T13:34:25.776Z",
      },
      {
        user_id: 2,
        first_name: "Bob",
        surname: "Smith",
        email: "bob@example.com",
        phone_number: "+44 7000 222222",
        is_host: false,
        avatar: "https://example.com/images/bob.jpg",
        created_at: "2025-09-18T13:34:25.776Z",
      },
    ];

    const ref = createUsersRef(users);

    expect(ref).toEqual({ "Alice Johnson": 1, "Bob Smith": 2 });
  });
});
