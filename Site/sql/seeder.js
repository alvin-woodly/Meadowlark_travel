const {Vacation} = require("./models/vacation");
const sequelize = require("./db");

//this might not work
async function getVacationCount()
{
    try {
        const count = await Vacation.count();
        return count;
    } catch (err) {
        console.log(`Error occurred during vacation count retrieval: ${err.message}`);
        return 0;
    }
}

async function seedVacations(){
    console.log("seeding database with vacations.....");

    try{
        const HoodRiverDayTrip = await Vacation.create({
            name: "Hood River Day Trip",
            slug:"hood-river-day-trip",
            category:"Day Trip",
            sku:"HR199",
            description:"Spend a day sailing on the Columbia and enjoying craft beers in Hood River!",
            location_search:"Hood River, Oregon, USA",
            location_lat: null,
            location_lng:null,
            price:99.95,
            tags:["day trip", "hood river", "sailing", "windsurfing", "breweries"],
            in_season:true,
            available:true,
            requires_waiver:false,
            maximum_guests:16,
            notes:null,
            packages_sold:0
        });
    
        const oregonCoastGetaway = await Vacation.create({
                name: 'Oregon Coast Getaway',
                slug: 'oregon-coast-getaway',
                category: 'Weekend Getaway',
                sku: 'OC39',
                description: 'Enjoy the ocean air and quaint coastal towns!',
                location_search: 'Cannon Beach, Oregon, USA',
                location_lat: null,
                location_lng:null,
                price: 269.95,
                tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
                in_season: false,
                available: true,
                requires_waiver:false,
                maximum_guests: 8,
                notes: null,
                packages_sold: 0,
        });
    
        const vacationInBend = await Vacation.create({
                name: 'Rock Climbing in Bend',
                slug: 'rock-climbing-in-bend',
                category: 'Adventure',
                sku: 'B99',
                description: 'Experience the thrill of climbing in the high desert.',
                location_search: 'Bend, Oregon, USA',
                location_lat: null,
                location_lng:null,
                price: 289.95,
                tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
                in_season: true,
                available: false,
                requiresWaiver: true,
                maximum_guests: 4,
                notes: 'The tour guide is currently recovering from a skiing accident.',
                packages_sold: 0,
        });

        console.log(`vacations in database saved successfully \n ${HoodRiverDayTrip.toJSON()} 
        \n ${oregonCoastGetaway.toJSON()} \n ${vacationInBend.toJSON()}`);

    }
    catch(err)
    {
        console.log(`error occurred while seeding database: ${err}`);
    }
}

(async function CreateVacationTableWithData(){
    try{
        await Vacation.sync();
        const vacationCount = await getVacationCount();
        
        if(vacationCount === 0)
        {
            await seedVacations();
        }
        else{
            console.log("Vacations already exist in the database");
            try{
                const vacations = await Vacation.findAll();
                vacations.forEach(vacation=>{
                    console.log(vacation.name);
                });
                
            }
            catch(err)
            {
                console.log(`error fetching Vacations data  ${err}`)
            }
        }
    }
    catch(err)
    {
        console.error(`Error during vacation table setup: ${err.message}`);
    }
})();
