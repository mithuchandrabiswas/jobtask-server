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
        // 'http://localhost:5173',
        // 'http://localhost:5000',
        'https://job-task-383b4.web.app'
    ],
    credentials: true,
    optionSuccessStatus: 200,
}
// ==========> Middleware <=========
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//Create Custom Middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    // console.log(token);
    if (!token) {
        return res.status(401).send({ message: 'unathorized access' });
    }
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, docoded) => {
            if (err) {
                console.log(err);
                return res.status(401).send({ message: 'unathorized access' });
            }
            console.log(docoded);
            req.user = docoded
            next();
        })
    }
}

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.2bu9h7l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Create database and collection
        const productsCollection = client.db("productsDB").collection("productsData");

        //========> Token related API <==========
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            // console.log('dynamic token of', user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
            // res.send(token); // SEND TOKEN FRONT IN BY AXIOS ER DATA ER VITORE
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
            }).send({ success: true });
        })
        // Token clear after user logOut
        app.get('/logout', async (req, res) => {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 0,
            }).send({ success: true });
        })

        // app.get('/products', async (req, res) => {
        //     try {
        //         const searchQuery = req.query.search;
        //         const filterQuery = req.query.filter;
        //         const sortQuery = req.query.sort;

        //         // Initialize the query object
        //         let query = {};

        //         // Add filter condition
        //         if (filterQuery) {
        //             query.category = filterQuery;
        //         }

        //         // Add search condition
        //         if (searchQuery) {
        //             query.post_title = { $regex: searchQuery, $options: 'i' };
        //         }

        //         // Initialize sorting options
        //         let sortOptions = {};
        //         if (sortQuery) {
        //             sortOptions.deadline = sortQuery === 'asc' ? 1 : -1;
        //         }

        //         // Fetch results from the collection with combined query and sort options
        //         const result = await productsCollection.find(query).sort(sortOptions).toArray();

        //         // Send the result as the response
        //         res.send(result);
        //     } catch (error) {
        //         // Handle errors and send a response with status code 500
        //         res.status(500).send({ error: 'An error occurred while fetching volunteers data' });
        //     }
        // });

        // Products endpoint with pagination, search, filter, and sort
        app.get('/products', async (req, res) => {
            try {
                const { search, filter, sort, page = 1, limit = 10 } = req.query;

                // Initialize the query object
                let query = {};

                // Add filter condition
                if (filter) {
                    query.category = filter;
                }

                // Add search condition
                if (search) {
                    query.product_name = { $regex: search, $options: 'i' };
                }

                // Initialize sorting options
                let sortOptions = {};
                if (sort === 'price-asc') {
                    sortOptions.price = 1;
                } else if (sort === 'price-desc') {
                    sortOptions.price = -1;
                } else if (sort === 'date-asc') {
                    sortOptions.creation_date = 1;
                } else if (sort === 'date-desc') {
                    sortOptions.creation_date = -1;
                }

                // Pagination
                const skip = (page - 1) * limit;
                const result = await productsCollection.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit)).toArray();
                const totalProducts = await productsCollection.countDocuments(query);

                res.send({
                    data: result,
                    totalPages: Math.ceil(totalProducts / limit),
                    currentPage: parseInt(page),
                });
            } catch (error) {
                res.status(500).send({ error: 'An error occurred while fetching products' });
            }
        });

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