// const express = require('express');
// const cors = require('cors');
// const app = express();
// const path = require('path');
// const { MongoClient } = require('mongodb');

// const port = 3000;
// const uri = 'mongodb://myAdmin:kasidate01@localhost:27017/';

// app.use(cors());
// app.use(express.json());

// // Assuming your index.html file is in the same directory as your server file
// const indexPath = path.join(__dirname, 'index.html');

// app.get('/index', (req, res) => {
//   res.sendFile(indexPath);
// });

// app.get('/getid', async (req, res) => {
//   const client = new MongoClient(uri);
//   await client.connect();

//   try {
//     const users = await client.db('SaveImages').collection('Images').find({}).toArray();

//     // Extracting values from $oid field
//     const base64Values = users.map((user)=> user.image);
//     const upload_time = users.map((user)=> user.upload_time);
//     const stringUpload = upload_time.map(String);
//     res.status(200).send({base64Values,stringUpload});
//   } finally {
//     await client.close();
//   }
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const { MongoClient } = require('mongodb');

//const port = 3000;
let port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
//const uri = "mongodb+srv://myAdmin:kasidate01@cluster0.vjo2bfj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const indexPath = path.join(__dirname, 'public/index.html');

app.get('/', (req, res) => {
    res.sendFile(indexPath);
});


// app.get('/getid/:date', async (req, res) => {
//    const client = new MongoClient(uri);
//    await client.connect();

//    try {
//      const selectedDate = req.params.date;
//      const users = await client.db('SaveImages').collection('Images').find({ upload_time: selectedDate }).toArray();

//      const base64Values = users.map((user) => user.image);
//      res.status(200).send(base64Values);
//    } finally {
//      await client.close();
//    }
// });

app.get('/getdate/:date', async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();

    try {
        const selectedDate = req.params.date;
        const month = new Date(selectedDate).getMonth() + 1; // Adding 1 because months are zero-based
        const users = await client.db('SaveImages').collection('Images').find({ upload_time: selectedDate }).toArray();

        const base64Values = users.map((user) => user.image);
        res.status(200).send(base64Values);

        // Save count to a collection for this month
        const count = users.length;
        const monthName = getMonthName(month);

        const countCollection = client.db('SaveImages').collection(monthName);
        const existingCount = await countCollection.findOne({ date: selectedDate });

        if (existingCount) {
            await countCollection.updateOne({ date: selectedDate }, { $set: { count } });
        } else {
            await countCollection.insertOne({ date: selectedDate, count });
        }
    } finally {
        await client.close();
    }
});

function getMonthName(month) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1];
}


app.get('/getcntDay/:date', async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();

    try {
        const selectedDate = req.params.date;
        const month = new Date(selectedDate).getMonth() + 1;
        const monthName = getMonthName(month);

        const countCollection = client.db('SaveImages').collection(monthName).find({ date: selectedDate }).toArray();
        const getCounts = (await countCollection).map((user) => user.count);

        res.status(200).send(getCounts);
    } finally {
        await client.close();
    }
});

app.get('/getcntMonths/:month', async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();


    try {
        const monthName = req.params.month;
        const countCollection = client.db('SaveImages').collection(monthName);
        const count = await countCollection.estimatedDocumentCount({});
        console.log(count);

        res.status(200).send({ count });
    } finally {
        await client.close();
    }
});


app.listen(port, () => {
    //console.log(`Example app listening at http://localhost:${port}`);
    console.log(`Connected to MongoDB Atlas! ${port}`);
});
