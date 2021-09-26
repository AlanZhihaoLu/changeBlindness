const express = require('express');
const cors = require('cors');
const {connectDatabase} = require("./database")

const app = express();

const mount = async (app) => {
    try {
        app.use(cors());
        app.use(express.json({ limit: '50mb' }));
        app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

        const db = await connectDatabase();

        app.get('/', (req, res) => {
            res.send("Server running...")
        });

        app.post('/pilot', async (req, res) => {
            const {exp_data} = req.body
            const parsed_array = JSON.parse(exp_data)
            const dbResp = await db.fcb02.insertMany(parsed_array)
            res.sendStatus(200)
        });

        app.get('/pilot', (req, res) => {
            res.json("I'm awake")
        });

        // app.delete('/pilot', async (req, res) => {
        //     try {
        //         const result = await db.fcb02.deleteMany();
        //         res.sendStatus(200)
        //     } catch (err) {
        //         res.status(400).json(err)
        //     }
        // })

        app.listen(process.env.PORT || 3000, ()=>{
            console.log(`app is running on port ${process.env.PORT}`)
        });
    } catch(err) {
        console.log("this is a server error:", err)
    }
}

mount(express())