//import sequelize
const {Sequelize} = require("sequelize");

//put hardcoded values in credentials
const sequelize = new Sequelize("meadowlark","root","root",{
    host:"localhost",
    dialect:"mysql"
});


(async function authenticateDb()
{
    try{
        await sequelize.authenticate();
        console.log("connection established successfully");
    }   
    catch(err)
    {
        console.log(`an error occurred trying to connect to MySQL: ${err} `);
    }
    finally{
        await sequelize.close();
    }
})();