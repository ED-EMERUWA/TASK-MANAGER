import { Sequelize } from "sequelize";
import dotenv from "dotenv";


// Load the environment variables from the .env file
dotenv.config();

const sequelize = new Sequelize (
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_USER_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        ssl: true,
        logging: false,
    }
);

// Lets start this babay uppppppp with a try and catch

try{
    sequelize.authenticate();
    console.log(' Its alive, sequelize is aliiiveeee')
  
    // Now show me them sweet tables
    const tables = await sequelize.query('SHOW TABLES')
    console.log(tables)
}
catch(err){
    console.error(`Error connecting Sequelize with database: ${err.message}`);
}
export default sequelize;