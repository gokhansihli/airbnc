function formatUsers(usersData) {
  return usersData.map(
    ({
      first_name,
      surname,
      email,
      phone_number,
      is_host,
      avatar,
      password_hash,
    }) => [
      first_name,
      surname,
      email,
      phone_number,
      is_host,
      avatar,
      password_hash,
    ]
  );
}

module.exports = formatUsers;
