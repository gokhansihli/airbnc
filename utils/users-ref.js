function createUsersRef(usersData) {
  const usersID = usersData.reduce((ref, user) => {
    const fullName = `${user.first_name} ${user.surname}`;
    ref[fullName] = user.user_id;
    return ref;
  }, {});

  return usersID;
}

module.exports = createUsersRef;
