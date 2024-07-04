const {MongoClient, ServerApiVersion} = require('mongodb');
const uri = "mongodb+srv://kevin:hurricane@firstproject.m9dq4lf.mongodb.net/?retryWrites=true&w=majority&appName=FirstProject";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
const database = client.db("grades");
const grades = database.collection("grades");

async function startServer() {
    await client.connect();
    console.log("connected to MongoDB");

    app.listen(port, () =>{
        console.log(`Server has started on port ${port}`);
    })
}

startServer();


const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('Client'));
app.use(express.json());

const C = 1, R = 2, U = 3, D = 4, A=5;

let response;

app.get('/average', async(req, res) => {
    await dbCRUD({}, A);
    res.status(200).json({info: response});
});

app.post('/insert', (req, res) => {
    const mark = req.body;
    dbCRUD(mark, C).catch(console.dir);
    res.status(200).send({status: 'received'});
});

app.post('/read', async (req, res) => {
    const mark = req.body;
    await dbCRUD(mark, R).catch(console.dir);
    res.status(200).json({info: response});
});

app.post('/update', (req, res) => {
    const mark = req.body;
    dbCRUD(mark, U).catch(console.dir);
    res.status(200).send({status: 'received'});
});

app.post('/delete', (req, res) => {
    const mark = req.body;
    dbCRUD(mark, D).catch(console.dir);
    res.status(200).send({status: 'received'});
});

async function dbCRUD(mark, op) {
    try {
        if (op === C) {
            await grades.insertOne(mark);
        } else if (op === R) {
            if (await grades.countDocuments(mark) === 0) {
                response = '';
            } else {
                const options = {
                    sort: { title: 1},
                    projection: {_id: 0, name: 1, weighting: 1, numerator: 1, denominator: 1}
                };
                response = [];
                const cursor = await grades.find(mark, options);
                for await (const doc of cursor) {
                    response.push(doc);
                }
            }
        } else if (op === U) {
            await grades.replaceOne(mark.init, mark.replace);
        } else if (op === D) {
            await grades.deleteOne(mark);
        } else {
            if (await grades.countDocuments({}) === 0) {
                response = '';
            } else {
                response = [];
                const cursor = await grades.find({});
                for await (const doc of cursor) {
                    response.push(doc);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
}

process.on('SIGINT', async () => {
    await client.close();
    console.log("connection closed");
    process.exit(0);
});