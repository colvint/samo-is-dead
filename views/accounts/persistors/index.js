const { EFFECTS: { dbInsert } } = require('@aqueoss/system');

const insertAccounts = function * (db, accounts) {
  return yield dbInsert(db, 'accounts', accounts.map(a => ({
    firstName: a.name.first,
    lastName: a.name.last,
    email: a.email,
    gender: a.gender,  
  })));
};

module.exports = {
  insertAccounts,
};
