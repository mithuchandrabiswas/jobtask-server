const express = require('express');
const cors = require('cors');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:5173',  // Local development
        'https://job-task-383b4.web.app',  // Deployed client
        'https://jobtask-mnw6dsh0q-mithu-chandra-biswas-projects.vercel.app' // Deployed server
    ],
    credentials: true,
    optionSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// JWT Authentication Middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized access' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized access' });
        }
        req.user = decoded;
        next();
    });
};

// MongoDB Connection
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.2bu9h7l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        const productsCollection = client.db("productsDB").collection("productsData");

        // JWT Token Generation Endpoint
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            }).send({ success: true });
        });

        // Logout Endpoint to Clear Token
        app.get('/logout', async (req, res) => {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 0,
            }).send({ success: true });
        });

        // Products API Endpoint with Pagination, Search, Filter, and Sort
        app.get('/products', async (req, res) => {
            try {
                const { search, filter, sort, page = 1, limit = 10 } = req.query;

                let query = {};
                if (filter) query.category = filter;
                if (search) query.product_name = { $regex: search, $options: 'i' };

                let sortOptions = {};
                if (sort === 'price-asc') sortOptions.price = 1;
                else if (sort === 'price-desc') sortOptions.price = -1;
                else if (sort === 'date-asc') sortOptions.creation_date = 1;
                else if (sort === 'date-desc') sortOptions.creation_date = -1;

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

        console.log('Successfully connected to MongoDB!');
    } finally {
        // Will close connection in production.
    }
}

run().catch(console.dir);

// Root Route
app.get('/', (req, res) => {
    res.send('Hello Server...');
});

// Server Listening
app.listen(port, () => console.log(`Server running on port ${port}`));
