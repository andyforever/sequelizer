let SequelizeAuto = require('sequelize-auto')
module.exports = function(config, callback) {
  // const {database, username, password, ...options} = config; //syntactic not support
  let auto = new SequelizeAuto(config.database, config.username, config.password, config);

  auto.run(function(err){
    if (err) throw err;
    callback(auto)
  })
}