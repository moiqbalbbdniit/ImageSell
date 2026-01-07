import mongoose, { mongo } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);    
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {con:null,promise:null}
}

export async function connectToDatabase() {
    if(cached.con){
        return cached.con;
    }
    if(!cached.promise){
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
        };  
        cached.promise = mongoose.connect(MONGODB_URI,opts).then(()=>mongoose.connection)
    }

    try{
        cached.con = await cached.promise;
        console.log("Connected to MongoDB");
        
    }
    catch(err){
        cached.promise = null;
        console.error("Error connecting to MongoDB:", err);
        throw err;
    }
    return cached.con;
}

