import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import { UserModel } from './schemas/User.js';
import { ConversationModel } from './schemas/Conversation.js';

let DB_HOST=process.env.DB_HOST

let DB=process.env.DB

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
mongoose.set('strictQuery', false);

const connectToDatabase = async ( 
  databaseName= null,
  dbHost= null
) => {
  try {
    if( databaseName ){ DB = databaseName; }
    if( dbHost ){ DB_HOST = dbHost; }
    const mongoDB = `mongodb://${DB_HOST}/${DB}`;
    console.info(`Connecting to database ${DB}...`);
    await mongoose.connect(mongoDB);
    
    console.info(`Connected to database ${DB}`);
  } catch (error) {
    console.error(`Error connecting to database: ${DB} ${error}`);
  }
};


const refreshDatabase = async (databaseName= null,
    dbHost= null) => {
    await connectToDatabase(databaseName,dbHost);
    await UserModel.deleteMany({})
    await ConversationModel.deleteMany({})
    
};

export { connectToDatabase, refreshDatabase   };