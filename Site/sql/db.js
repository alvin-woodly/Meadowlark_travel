//import sequelize
const {Sequelize} = require("sequelize");
const {credentials} = require("../config");

//put hardcoded values in credentials

const sequelize = new Sequelize(credentials.sql.database,credentials.sql.username,credentials.sql.password,{
    host:credentials.sql.hostname,
    dialect:"mysql"
});

//this is used to authenticate the connection:
(async function authenticateDb()
{
   try{
       await sequelize.authenticate();
       console.log("connection established successfully");
   }   
   catch(err)
   {
       console.log(`an error occurred trying to connect to MySQL: ${err} `);
       sequelize.close();
       process.exit(1);
   }

})();

exports.sequelize = sequelize;




