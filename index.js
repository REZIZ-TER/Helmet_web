const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const { MongoClient } = require('mongodb');

//const port = 3000;
let port = process.env.PORT || 3000;
const uri = "mongodb+srv://myAdmin:kasidate01@cluster0.vjo2bfj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" || process.env.MONGODB_CONNECT_URI;
//const uri = "mongodb+srv://myAdmin:kasidate01@cluster0.vjo2bfj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const indexPath = path.join(__dirname, 'public/index.html');

app.get('/', (req, res) => {
    res.sendFile(indexPath);
});

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

///
// app.get('/getcntDay/:date', async (req, res) => {
//     const client = new MongoClient(uri);
//     await client.connect();

//     try {
//         const selectedDate = req.params.date;
//         const month = new Date(selectedDate).getMonth() + 1;
//         const monthName = getMonthName(month);

//         const countCollection = client.db('SaveImages').collection(monthName);

//         // ค้นหาข้อมูลใน collection สำหรับวันที่ระบุ
//         const existingData = await countCollection.findOne({ date: selectedDate });

//         if (!existingData) {
//             // หากไม่มีข้อมูล ให้เพิ่มข้อมูลลงไป
//             await countCollection.insertOne({
//                 date: selectedDate,
//                 count: 0
//             });

//             res.status(200).send([0]); // ส่งค่าเป็น Array ของค่าเพียงตัวเดียว ซึ่งในที่นี้คือ 0
//         } else {
//             // หากมีข้อมูลให้ดึงค่า count ออกมาและส่งให้กับ client
//             res.status(200).send([existingData.count]);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('เกิดข้อผิดพลาด');
//     } finally {
//         await client.close();
//     }
// });
///


app.get('/getcntDay/:date', async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();

    try {
        const selectedDate = req.params.date;
        const month = new Date(selectedDate).getMonth() + 1;
        const monthName = getMonthName(month);

        const countCollection = client.db('SaveImages').collection('Images');

        // ค้นหาข้อมูลใน collection สำหรับวันที่ระบุ
        const totalCounts = await countCollection.aggregate([
            {
                $match: {
                    upload_time: selectedDate
                }
            },
            {
                $group: {
                    _id: null,
                    totalNoHelmet: {
                        $sum: "$count_no_helmet"
                    },
                    totalRider: {
                        $sum: "$count_rider"
                    }
                }
            }
        ]).toArray();

        if (totalCounts.length === 0) {
            // หากไม่มีข้อมูล ให้เพิ่มข้อมูลลงไป
            await countCollection.insertOne({
                date: selectedDate,
                count_no_helmet: 0,
                count_rider: 0
            });

            res.status(200).send({
                count_no_helmet: 0,
                count_rider: 0
            });
        } else {
            // หากมีข้อมูลให้ส่งผลลัพธ์รวมกับ count_no_helmet และ count_rider ให้กับ client
            // res.status(200).send({
            //     count_no_helmet: totalCounts[0].totalNoHelmet,
            //     count_rider: totalCounts[0].totalRider
            // });
            res.status(200).send([
                totalCounts[0].totalNoHelmet,
                totalCounts[0].totalRider]
            );
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาด');
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






// app.get('/getcntDay/:date', async (req, res) => {
//     const client = new MongoClient(uri);
//     await client.connect();

//     try {
//         const selectedDate = req.params.date;
//         const month = new Date(selectedDate).getMonth() + 1;
//         const monthName = getMonthName(month);

//         const countCollection = client.db('SaveImages').collection(monthName).find({ date: selectedDate }).toArray();
//         const getCounts = (await countCollection).map((user) => user.count);

//         res.status(200).send(getCounts);
//     } finally {
//         await client.close();
//     }
// });