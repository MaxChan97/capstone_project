// Dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

// Express Server
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connect
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log("MongoDB database successfully connected");
});

const usersRouter = require('./routes/users');

app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// const MongoClient = require('mongodb').MongoClient;
// MongoClient.connect(uri, { useUnifiedTopology: true })
//   .then(client => {
//     console.log('Connected to Database');
//     const db = client.db('test');
//     const userCollection = db.collection('user')
    
//     app.listen(3000, function() {
//       console.log('listening on 3000');
//     });

//     app.get('/', (req, res) => {
//       db.collection('user').find().toArray()
//         .then(results => {
//           console.log(results)
//           res.send(results)
//         })
//         .catch(error => console.error(error))
//     });

//     app.post('/', (req, res) => {
//       console.log('POST body: ' + JSON.stringify((req.body)));
//       userCollection.insertOne(req.body)
//         .then(result => {
//           console.log(result)
//         })
//         .catch(error => console.error(error))
//     });

//     app.put('/', (req, res) => {
//       console.log('PUT body: ' + JSON.stringify((req.body)));
//       userCollection.findOneAndUpdate(
//         { name: 'carl' },
//         {
//           $set: {
//             name: req.body.name,
//           }
//         },
//         {
//           upsert: true
//         }
//       )
//       .then(result => {
//         console.log(result)
//         res.send("Success")
//        })
//       .catch(error => console.error(error))
//     });

//     app.delete('/', (req, res) => {
//       userCollection.deleteOne(
//         { name: req.body.name }
//       )
//         .then(result => {
//           res.json("Deleted")
//         })
//         .catch(error => console.error(error))
//     })
//   })

