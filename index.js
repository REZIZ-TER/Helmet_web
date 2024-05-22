const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const request = require('request'); // ใช้งาน request
const { MongoClient } = require('mongodb');

//const port = 3000;
let port = process.env.PORT || 3000;
const uri = "mongodb+srv://myadmin:kasidate01@mycluster.puhoukq.mongodb.net/?retryWrites=true&w=majority&appName=myCluster" || process.env.MONGODB_CONNECT_URI;
//const uri = "mongodb+srv://myAdmin:kasidate01@cluster0.vjo2bfj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const indexPath = path.join(__dirname, 'public/index.html');

app.get('/', (req, res) => {
    res.sendFile(indexPath);
});

// app.get('/getdate/:date', async (req, res) => {
//     const client = new MongoClient(uri);
//     await client.connect();

//     try {
//         const selectedDate = req.params.date;
//         const month = new Date(selectedDate).getMonth() + 1; // Adding 1 because months are zero-based
//         const users = await client.db('SaveImages').collection('Images').find({ upload_time: selectedDate }).toArray();

//         const base64Values = users.map((user) => user.image);
//         res.status(200).send(base64Values);

//         // Save count to a collection for this month
//         const count = users.length;
//         const monthName = getMonthName(month);

//         const countCollection = client.db('SaveImages').collection(monthName);
//         const existingCount = await countCollection.findOne({ date: selectedDate });

//         if (existingCount) {
//             await countCollection.updateOne({ date: selectedDate }, { $set: { count } });
//         } else {
//             await countCollection.insertOne({ date: selectedDate, count });
//         }
//     } finally {
//         await client.close();
//     }
// });

app.get('/getdate', async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();

    try {
        const { startDate, endDate } = req.query;

        if (!startDate && !endDate) {
            return res.status(400).send('Please provide at least one date.');
        }

        let query = {};
        if (startDate && endDate) {
            query.upload_date = { $gte: startDate, $lte: endDate };
        } else if (startDate) {
            query.upload_date = startDate;
        } else if (endDate) {
            query.upload_date = endDate;
        }

        query.image = { $exists: true, $ne: null };

        const users = await client.db('SaveImages').collection('Images').find(query).toArray();
        const base64Values = users.map((user) => user.image);

        res.status(200).send(base64Values);

        // Save count to a collection for the month of the start date
        const start = new Date(startDate || endDate);
        const month = start.getMonth() + 1;
        const monthName = getMonthName(month);
        const count = users.length;

        const countCollection = client.db('SaveImages').collection(monthName);
        const existingCount = await countCollection.findOne({ date: startDate || endDate });

        if (existingCount) {
            await countCollection.updateOne({ date: startDate || endDate }, { $set: { count } });
        } else {
            await countCollection.insertOne({ date: startDate || endDate, count });
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

// app.get('/getcntDay/:date', async (req, res) => {
//     const client = new MongoClient(uri);
//     await client.connect();

//     try {
//         const selectedDate = req.params.date;
//         const month = new Date(selectedDate).getMonth() + 1;
//         const monthName = getMonthName(month);

//         const countCollection = client.db('SaveImages').collection('Images');

//         // ค้นหาข้อมูลใน collection สำหรับวันที่ระบุ
//         const totalCounts = await countCollection.aggregate([
//             {
//                 $match: {
//                     upload_time: selectedDate
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalNoHelmet: {
//                         $sum: "$count_no_helmet"
//                     },
//                     totalRider: {
//                         $sum: "$count_rider"
//                     }
//                 }
//             }
//         ]).toArray();

//         if (totalCounts.length === 0) {
//             // หากไม่มีข้อมูล ให้เพิ่มข้อมูลลงไป
//             await countCollection.insertOne({
//                 upload_time: selectedDate,
//                 count_no_helmet: 0,
//                 count_rider: 0
//             });

//             res.status(200).send({
//                 count_no_helmet: 0,
//                 count_rider: 0
//             });
//         } else {
//             res.status(200).send([
//                 totalCounts[0].totalNoHelmet,
//                 totalCounts[0].totalRider]
//             );
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('เกิดข้อผิดพลาด');
//     } finally {
//         await client.close();
//     }
// });


// app.get('/getcntDay/:date', async (req, res) => {
//     const client = new MongoClient(uri);
//     await client.connect();

//     try {
//         const selectedDate = req.params.date;
//         const month = new Date(selectedDate).getMonth() + 1;
//         const monthName = getMonthName(month);

//         const countCollection = client.db('SaveImages').collection('Images');

//         // ค้นหาข้อมูลใน collection สำหรับวันที่ระบุ
//         const totalCounts = await countCollection.aggregate([
//             {
//                 $match: {
//                     upload_time: selectedDate
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalNoHelmet: {
//                         $sum: "$count_no_helmet"
//                     },
//                     totalRider: {
//                         $sum: "$count_rider"
//                     }
//                 }
//             }
//         ]).toArray();

//         if (totalCounts.length === 0) {
//             // หากไม่มีข้อมูล ให้เพิ่มข้อมูลลงไป
//             await countCollection.insertOne({
//                 upload_time: selectedDate,
//                 count_no_helmet: 0,
//                 count_rider: 0
//             });

//             // ส่งค่า 0 กลับเมื่อไม่มีข้อมูล
//             res.status(200).send([0, 0]);
//         } else {
//             res.status(200).send([
//                 totalCounts[0].totalNoHelmet,
//                 totalCounts[0].totalRider
//             ]);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('เกิดข้อผิดพลาด');
//     } finally {
//         await client.close();
//     }
// });

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
                    upload_time: selectedDate,
                    image: { $exists: true, $ne: null } // กรองเฉพาะเอกสารที่มี image
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
                upload_time: selectedDate,
                count_no_helmet: 0,
                count_rider: 0
            });

            // ส่งค่า 0 กลับเมื่อไม่มีข้อมูล
            res.status(200).send([0, 0]);
        } else {
            res.status(200).send([
                totalCounts[0].totalNoHelmet,
                totalCounts[0].totalRider
            ]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาด');
    } finally {
        await client.close();
    }
});



// app.get('/getcntMonths/:month', async (req, res) => {
//     const client = new MongoClient(uri);
//     await client.connect();


//     try {
//         const monthName = req.params.month;
//         const countCollection = client.db('SaveImages').collection(monthName);
//         const count = await countCollection.estimatedDocumentCount({});
//         console.log(count);

//         res.status(200).send({ count });
//     } finally {
//         await client.close();
//     }
// });


app.get('/getcntMonths/:month', async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();

    try {
        const selectedMonth = req.params.month;
        const countCollection = client.db('SaveImages').collection('Images');

        // แปลงชื่อเดือนที่รับมาเป็นรูปแบบที่ MongoDB ใช้ได้ (03)
        const monthNum = getMonthNumber(selectedMonth);

        // ค้นหาข้อมูลใน collection สำหรับเดือนที่ระบุ
        const totalCounts = await countCollection.aggregate([
            {
                $match: {
                    // ใช้ regex เพื่อค้นหาข้อมูลที่มี upload_time ตรงกับเดือนที่เลือก
                    upload_time: new RegExp(`^2024-${monthNum}`),
                    image: { $exists: true, $ne: null }
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
            // หากไม่มีข้อมูล ให้ส่งกลับเป็น 0
            res.status(200).send({
                count_no_helmet: 0,
                count_rider: 0
            });
        } else {
            res.status(200).send({
                count_no_helmet: totalCounts[0].totalNoHelmet,
                count_rider: totalCounts[0].totalRider
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาด');
    } finally {
        await client.close();
    }
});

// Function สำหรับแปลงชื่อเดือนเป็นเลขเดือน (03)
function getMonthNumber(month) {
    const months = {
        "January": "01",
        "February": "02",
        "March": "03",
        "April": "04",
        "May": "05",
        "June": "06",
        "July": "07",
        "August": "08",
        "September": "09",
        "October": "10",
        "November": "11",
        "December": "12"
    };
    return months[month];
}



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
