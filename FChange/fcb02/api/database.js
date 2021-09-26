require('dotenv').config();
const { MongoClient } = require("mongodb");
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.86tph.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const connectDatabase = async () => {
    try {
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        const db = client.db("fcb02")
        return {
            fcb02: db.collection("pilot")
        }
    } catch (err) {
        console.log("this is a database error", err)
    }
} 


module.exports = {connectDatabase}