const express = require('express');
const cors = require('cors');
const fs = require("fs");
const path = require('path');
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const admin = require('firebase-admin');
const auth = require("./middleware/auth");
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
  res.status(200).send({
    "msg": "Connected"
  });
});

// Will return all the sodas
app.get('/sodas', async (req, res) => {
  const firebaseData = (await db.collection("Soda-Lineup").get()).docs;
  if (firebaseData.length === 0) {
    res.status(201).send({
      "msg": "There are no soda products selling right now"
    });
    return;
  }
  let result = [];
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
    res.status(200).send({
      "data": result
    });
    return;
  }
  res.status(500).send({
    "msg": "Something went wrong on our end"
  });
  return;
});

// Will decrease the quantity of remaining sodas by one and return the soda that was "purchased"
app.post('/soda', async (req, res) => {
  if (!req.body.productName) {
    res.status(400).send({
      "msg": "Need productName"
    });
    return;
  }
  const docName = req.body.productName.toLowerCase();
  const sodaRef = await db.collection("Soda-Lineup").doc(`${docName}`).get();
  if (!sodaRef.exists) {
    res.status(401).send({
      "msg": "Soda was not found"
    });
    return;
  }
  if (parseInt(sodaRef._fieldsProto.remaining.integerValue) === 0) {
    res.status(201).send({
      "msg": "Soda is out of stock"
    });
    return;
  }
  const newRemaining = sodaRef._fieldsProto.remaining.integerValue - 1;
  const purchasedSoda = {
    productName: sodaRef._fieldsProto.productName.stringValue,
    description: sodaRef._fieldsProto.description.stringValue,
    cost: sodaRef._fieldsProto.cost.stringValue,
    max: parseInt(sodaRef._fieldsProto.max.integerValue),
    remaining: newRemaining
  };

  db.collection("Soda-Lineup").doc(`${docName}`).update({
    remaining: newRemaining
  });
  res.status(200).send({
    "data": purchasedSoda
  });
  return;
});

// Will accept password and, if correct, return a web token which is needed to access the admin page and access the remaining admin endpoints
app.post("/login", async (req, res) => {
  if (!req.body.password) {
    res.status(400).send({
      "msg": "Need password"
    });
    return;
  }
  const data = await db.collection('admins').doc(`ceo`).get();
  if (!data.exists) {
    res.status(500).send({
      "msg": "There is not an account registered with the ceo"
    });
    return;
  }
  if (req.body.password !== data._fieldsProto.password.stringValue) {
    res.status(401).send({
      "msg": "Incorrect Password"
    });
    return;
  }
  else {
    const token = jwt.sign(req.body.password, process.env.SECRET);
    res.status(200).send({
      "data": {
        token
      }
    });
    return;
  }
});

// Will increment the remaining sodas by the quantity provided unless it overflows
app.post('/restock', auth, async (req, res) => {
  if (!req.body.productName || !req.body.quantity) {
    res.status(400).send({
      "msg": "Need productName and quantity"
    });
    return;
  }
  const docName = req.body.productName.toLowerCase();
  const sodaRef = await db.collection("Soda-Lineup").doc(`${docName}`).get();
  if (!sodaRef.exists) {
    res.status(401).send({
      "msg": "Soda was not found"
    });
    return;
  }
  if (parseInt(sodaRef._fieldsProto.remaining.integerValue) + parseInt(req.body.quantity) > sodaRef._fieldsProto.max.integerValue) {
    res.status(402).send({
      "msg": "Cannot restock by that amount for it will overflow"
    })
    return;
  }
  const newRemaining = parseInt(sodaRef._fieldsProto.remaining.integerValue) + parseInt(req.body.quantity);
  const purchasedSoda = {
    productName: sodaRef._fieldsProto.productName.stringValue,
    description: sodaRef._fieldsProto.description.stringValue,
    cost: sodaRef._fieldsProto.cost.stringValue,
    max: sodaRef._fieldsProto.max.integerValue,
    remaining: newRemaining
  };
  db.collection("Soda-Lineup").doc(`${docName}`).update({
    remaining: newRemaining
  });
  res.status(200).send({
    "data": purchasedSoda
  });
  return;
});

// Will update the product by deleting the old one and creating a new one with the updated info
app.post('/product-update', auth, async (req, res) => {
  if (!req.body.productName || !req.body.newCost) {
    res.status(400).send({
      "msg": "Need productName and newCost"
    });
    return;
  }
  const docName = req.body.productName.toLowerCase();
  const sodaRef = await db.collection("Soda-Lineup").doc(`${docName}`).get();
  if (!sodaRef.exists) {
    res.status(401).send({
      "msg": "Soda was not found"
    });
    return;
  }
  await db.collection("Soda-Lineup").doc(`${docName}`).update({
    cost: req.body.newCost
  });
  const newSodaRef = await db.collection('Soda-Lineup').doc(`${docName}`).get();
  const newSoda = {
    productName: newSodaRef._fieldsProto.productName.stringValue,
    description: newSodaRef._fieldsProto.description.stringValue,
    cost: newSodaRef._fieldsProto.cost.stringValue,
    max: newSodaRef._fieldsProto.max.integerValue,
    remaining: newSodaRef._fieldsProto.remaining.integerValue
  };
  res.status(200).send({
    "data": newSoda
  });
  return;
});

// Will create a new product. Note that the remaining quantity will start at 0
app.post('/new-product', auth, async (req, res) => {
  if (!req.body.productName || !req.body.cost || !req.body.description || !req.body.max) {
    res.status(400).send({
      "msg": "Need productName, description, cost, and max"
    });
    return;
  }
  const docName = req.body.productName.toLowerCase();
  const sodaRef = await db.collection("Soda-Lineup").doc(`${docName}`).get();
  if (sodaRef.exists) {
    res.status(401).send({
      "msg": "A soda with that name already exists"
    });
    return;
  }
  const newSoda = {
    productName: req.body.productName,
    description: req.body.description,
    cost: req.body.cost,
    max: req.body.max,
    remaining: 0
  };
  await db.collection("Soda-Lineup").doc(`${docName}`).set(newSoda);
  res.status(200).send({
    "data": newSoda
  });
  return;
});

// Will remove the product from the database
app.delete('/product-removal', auth, async (req, res) => {
  if (!req.body.productName) {
    res.status(400).send({
      "msg": "Need productName"
    });
    return;
  }
  const docName = req.body.productName.toLowerCase();
  const sodaRef = await db.collection("Soda-Lineup").doc(`${docName}`).get();
  if (!sodaRef.exists) {
    res.status(401).send({
      "msg": "Soda was not found"
    });
    return;
  }
  await db.collection("Soda-Lineup").doc(`${docName}`).delete();
  res.status(200).send({
    "msg": "Removal successful"
  });
  return;
});

module.exports = app;