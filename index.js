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
//const uri = 'mongodb://myAdmin:kasidate01@localhost:27017/';
const uri = process.env.MONGODB_CONNECT_URI;
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const indexPath = path.join(__dirname, 'public/index.html');

app.get('/', (req, res) => {
   res.sendFile(indexPath);
});

app.get('/getid/:date', async (req, res) => {
   const client = new MongoClient(uri);
   await client.connect();

   try {
     const selectedDate = req.params.date;
     const users = await client.db('SaveImages').collection('Images').find({ upload_time: selectedDate }).toArray();

     const base64Values = users.map((user) => user.image);
     res.status(200).send(base64Values);
   } finally {
     await client.close();
   }
});

app.listen(port, () => {
   //console.log(`Example app listening at http://localhost:${port}`);
   console.log(`Connected to MongoDB Atlas!`);
});
