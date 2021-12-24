import express from 'express';
import cors from 'cors';
import fs from "fs";
import path from 'path';
import jwt from "jsonwebtoken";
import env from "dotenv";
import admin from 'firebase-admin';
import auth from "./middleware/auth.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const app = express();

// Load in .ENV file contents
env.config();

// Use express's body parser for post requests
app.use(express.json());

// Activate cors
app.use(cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'DELETE'],
    optionsSuccessStatus: 200
}));

// Firebase starter code
let serviceAccount;
if (fs.existsSync('./secrets/vending-machine-81e32-firebase-adminsdk-ftml1-bef0d2a34f.json')) {
    serviceAccount = require('./secrets/vending-machine-81e32-firebase-adminsdk-ftml1-bef0d2a34f.json');
} else {
    serviceAccount = JSON.parse(process.env.VENDING_FIREBASE_KEY);
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Endpoints start below
app.get('/', (req, res) => {
  res.send({
    "code": 200,
    "msg": "Connected"
  });
});

// Will accept password and, if correct, return a web token which is needed to access the admin page
app.post("/login", async (req, res) => {
  if (!req.body.password) {
    res.send({
      "code": 400,
      "msg": "Need password"
    });
  }
  const data = await db.collection('admins').doc(`ceo`).get();
  if (!data.exists) {
    res.send({
      "code": 500,
      "msg": "There is not an account registered with the ceo"
    });
    return;
  }
  if (req.body.password !== data._fieldsProto.password.stringValue) {
    res.send({
      "code": 401,
      "msg": "Incorrect Password"
    });
    return;
  }
  else {
    const token = jwt.sign(req.body.password, process.env.SECRET);
    res.send({
      "code": 200,
      "data": {
        token
      }
    });
    return;
  }
});

// Will return all the sodas
app.get('/sodas', async (req, res) => {
    const firebaseData = (await db.collection("Soda-Lineup").get()).docs;
    if (firebaseData.length === 0) {
        res.send({
            "code": 201,
            "msg": "There are no soda products selling right now"
        });
        return;
    }
    let result = [];
    console.log(firebaseData[0]._fieldsProto.remaining);
    firebaseData.forEach((soda) => {
        result.push({
            productName: soda._fieldsProto.productName.stringValue,
            description: soda._fieldsProto.description.stringValue,
            cost: soda._fieldsProto.cost.stringValue,
            max: soda._fieldsProto.max.integerValue,
            remaining: soda._fieldsProto.remaining.integerValue
        });
    })
    if (firebaseData.length >= 0) {
        res.send({
            "code": 200,
            "data": result
        });
        return;
    }
    res.send({
        "code": 500,
        "msg": "Something went wrong on our end"
    });
    return;
});


// Will decrease the quantity of remaining sodas by one and download the json file
app.post('/soda', async (req, res) => {
  if (!req.body.productName) {
    res.send({
      "code": 400,
      "msg": "Need productName and quantity"
    });
  }
  const docName = req.body.productName.toLowerCase();
  const sodaRef = await db.collection("Soda-Lineup").doc(`${docName}`).get();
  if (!sodaRef.exists) {
    res.send({
      "code": 401,
      "msg": "Soda was not found"
    });
    return;
  }
  // Decrease the remaining quantity by 1
  console.log(sodaRef._fieldsProto.remaining.integerValue);
  let newRemaining = sodaRef._fieldsProto.remaining.integerValue - 1;
  db.collection("Soda-Lineup").doc(`${docName}`).update({
    remaining: newRemaining
  });
  // Will need to download a json file depicting the soda
  res.send({
    "code": 200,
    "msg": "Success"
  });
  return;
});

//If authorized, will restock
// app.post('/re-stock', auth, async (req, res) => {
//     if (!req.body.quantity || !req.body.productName) {
//         res.send({
//             "code": 400,
//             "msg": "Need productName and quantity"
//         });
//     }
// })

app.listen(process.env.PORT || 5000, () => console.log("server starting on port 5000!"));