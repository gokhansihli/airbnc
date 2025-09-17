function formatUsers(usersData) {
  return usersData.map(
    ({ first_name, surname, email, phone_number, is_host, avatar }) => [
      first_name,
      surname,
      email,
      phone_number,
      is_host,
      avatar,
    ]
  );
}

module.exports = formatUsers;
