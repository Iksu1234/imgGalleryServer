const users = require("../assets/users.js");

// Cross reference user and password from users.js
// Return true if user and password match
const checkUserPw = async (account, password) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].userName == account && users[i].userPassword == password) {
      return true;
    }
  }
};

const checkUserRole = async (account) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].userName == account) {
      return users[i].isAdmin;
    }
  }
};

(module.exports = checkUserPw), checkUserRole;
