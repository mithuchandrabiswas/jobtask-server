const express = require('express');
const cors = require('cors');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Config
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5000',
    ],
    credentials: true,
    optionSuccessStatus: 200,
}
// ==========> Middleware <=========
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})
async function run() {
    try {
        

        // Send a ping to confirm a successful connection
        // await client.db('admin').command({ ping: 1 })
        console.log(
            'Pinged your deployment. You successfully connected to MongoDB!'
        )
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Hello Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))