//require
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pv2hb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// MiddleWare
const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload());

//Port
const port = 5000;

// Server Root
app.get('/', (req, res) => {
    res.send("Hello World!")
})

// Connect to Mingodb
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("creativeAgency").collection("services");
    const orderCollection = client.db("creativeAgency").collection("orders");
    const reviewCollection = client.db("creativeAgency").collection("reviews");
    const adminCollection = client.db("creativeAgency").collection("admin");

    // Service Api
    app.post('/addservice', (req, res) => {
        const file = req.files.file;
        const serviceName = req.body.serviceName;
        const serviceDetail = req.body.serviceDetail;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        serviceCollection.insertOne({ serviceName, serviceDetail, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    // Order Api
    app.post('/addorder', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const serviceName = req.body.serviceName;
        const serviceDetail = req.body.serviceDetail;
        const price = req.body.price;
        const status = req.body.status;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        orderCollection.insertOne({ name, email,serviceName,serviceDetail,price,status, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    // Review Api

    app.post('/addreview', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const designation = req.body.designation;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        reviewCollection.insertOne({ name, designation,description, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    //  Make Admin Api
    app.post('/makeadmin', (req, res)=>{
         const email = req.body;
         adminCollection.insertOne(email)
         .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    // Get Service
    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    //Get Order
    app.get('/orders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    //Get Review
    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    //Get Admin
    app.get('/admins', (req, res) => {
        adminCollection.find({ email: req.query.email})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

});


app.listen(process.env.PORT || port)