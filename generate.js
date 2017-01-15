var SequelizeAuto = require('sequelize-auto')
module.exports = function(database, username, password, options, callback) {
  var auto = new SequelizeAuto(database, username, password, options);

  auto.run(function(err){
    if (err) throw err;
    callback(auto)
  })
}