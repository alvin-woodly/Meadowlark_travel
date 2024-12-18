const { DataTypes, Op } = require("sequelize");
const {sequelize} =  require("../db");

const vacationInSeasonListener = sequelize.define("vacation_in_season_listener",{
    email:{
        type:DataTypes.STRING(200),
        allowNull:false,
        primaryKey:true
    },
    sku:{
        type:DataTypes.STRING(20),
        allowNull:false,
        primaryKey:true
    }
});

(async()=>{
    try{
        await vacationInSeasonListener.sync();
    }
    catch(err)
    {
        console.log(`error creating table for vacation in season listeners : ${err}`);
    }
})();


exports.addVacationInSeasonListener = async(useremail,vacationsku)=>{
    try{

     const [listener,created] = await vacationInSeasonListener.findOrCreate({
            where:{
                [Op.and]:[{email: useremail},{sku:vacationsku}]
            },
            defaults:{
                email:useremail,
                sku:vacationsku
            }
        });

        if(created)
        {
            console.log("listener created");
        }
        else{
            console.log("listener found");
        }
    }
    catch(err)
    {
        console.log(`there was an error adding vacationlistener ${err}`);
    }
}