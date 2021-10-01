require('dotenv').config()
const fs = require("fs");
const json2csv = require('csvjson-json2csv');

// const {performance} = require('perf_hooks');

const { MongoClient } = require("mongodb")

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.86tph.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connectDatabase = async () => {
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    const db = client.db("fcb02")
    return {
        fcb02: db.collection("pilot")
    }
}

const getData = async () => {
    const db = await connectDatabase()
    const agg = await db.fcb02.aggregate()
    const cursorToArray = await agg.toArray()
    // var t0 = performance.now();
    const newArray = cursorToArray.map(obj=>{
        delete obj.internal_node_id; 
        delete obj.trial_type; 
        delete obj.time_elapsed;
        delete obj._id;
        return obj})
    // var t1 = performance.now();
    // console.log("Call to newArray took " + (t1 - t0)*10*50 + " milliseconds.")
    var csv = json2csv(newArray);
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'_');
    fs.writeFileSync(`fcb02-pilot_${utc}.csv`, csv);
    console.log(`Saved fcb02-pilot_${utc}.csv`)
    // const arrToJson = `{ "data": ${JSON.stringify(cursorToArray)} }`
    // var utc = new Date().toJSON().slice(0,10).replace(/-/g,'_');
    // fs.writeFileSync(`invrb01_${utc}.json`, arrToJson);
}
getData();
