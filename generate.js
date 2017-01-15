var SequelizeAuto = require('sequelize-auto')
module.exports = function(database, username, password, options) {
  var auto = new SequelizeAuto(database, username, password, options);

  auto.run(function(err){
    if (err) throw err;
    console.log(auto.tables);
    console.log(auto.foreignKeys);
  })
}