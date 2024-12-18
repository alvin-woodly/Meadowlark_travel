const { DataTypes } = require("sequelize");
const {sequelize} = require("../db");
const _ = require("lodash");


const Vacation = sequelize.define("Vacation",{
    ID:{
        primaryKey:true,
        type: DataTypes.INTEGER,
        autoIncrement:true  
    },
    name:{
        type:DataTypes.STRING(200),
        allowNull:false
    },
    slug:{
        type:DataTypes.STRING(200),
        allowNull:false,
        unique:true
    },
    category:{
        type:DataTypes.STRING(50)
    },
    sku:{
        type:DataTypes.STRING(20)
    },
    description:{
        type:DataTypes.TEXT
    },
    location_search:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    location_lat:{
        type:DataTypes.DOUBLE
    },
    location_lng:{
        type:DataTypes.DOUBLE
    },
    price:{
        type:DataTypes.DECIMAL(10,2)
    },
    tags:{
        type:DataTypes.JSON
    },
    in_season:{
        type:DataTypes.BOOLEAN
    },
    available:{
        type:DataTypes.BOOLEAN
    },
    requires_waiver:{
        type:DataTypes.BOOLEAN
    },
    maximum_guests:{
        type:DataTypes.INTEGER
    },
    notes:{
        type:DataTypes.TEXT
    },
    packages_sold:{
        type:DataTypes.INTEGER
    }
});
//make sure the table exists:
(async()=>{
    try{
        console.log("creating table Vacations (if exists this will be skipped):")
        await Vacation.sync();
    }
    catch(err)
    {
        console.log(`error occurred during SQL table creation : ${err}`);
    }
})();

exports.Vacation = Vacation;


exports.getVacations = async()=>
{
    try{
        const vacations = await Vacation.findAll({raw:true});
        const vacationsAsObjects = vacations.map(vacation =>{
            const vacationObj = _.mapKeys(vacation,(value,key)=> _.camelCase(key));

            vacationObj.price = Number.parseFloat(vacationObj.price);
            vacationObj.location ={
                search: vacationObj.searchLocation,
                coordinates:{
                    lat:vacationObj.locationLat,
                    lng: vacationObj.locationLng
                }
            }
            return vacationObj;
        });

        return vacationsAsObjects;
    }
    catch(err)
    {
        console.log(`error trying to fetch vacations : ${err}`);
    }
}



//test if table exists first using .synch before you do the rest