const express = require('express');
const cors = require('cors');
const fs = require("fs");
const path = require('path');
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const admin = require('firebase-admin');
const auth = require("./middleware/auth");
// const { createRequire } = require("module");
// const require = createRequire(import.meta.url);
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


// Will decrease the quantity of remaining sodas by one and download the json file
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
  const newRemaining = sodaRef._fieldsProto.remaining.integerValue - 1;
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

// Will accept password and, if correct, return a web token which is needed to access the admin page and fetch the rest of the admin endpoints
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

// Will decrease the quantity of remaining sodas by one and download the json file
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
  if (parseInt(sodaRef._fieldsProto.remaining.integerValue) + req.body.quantity > sodaRef._fieldsProto.max.integerValue) {
    res.status(402).send({
      "msg": "Cannot restock by that amount for it will overflow"
    })
    return;
  }
  const newRemaining = parseInt(sodaRef._fieldsProto.remaining.integerValue) + req.body.quantity;
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

// Will decrease the quantity of remaining sodas by one and download the json file
app.post('/product-update', auth, async (req, res) => {
  if (!req.body.productName || !req.body.newProductName || !req.body.newCost || !req.body.newDescription || !req.body.newMax) {
    res.status(400).send({
      "msg": "Need productName, newProductName, description, cost, and max"
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
  const remaining = parseInt(req.body.newMax) < parseInt(sodaRef._fieldsProto.remaining.integerValue) ? parseInt(req.body.newMax) : parseInt(sodaRef._fieldsProto.remaining.integerValue);
  const updatedSoda = {
    productName: req.body.newProductName,
    description: req.body.newDescription,
    cost: req.body.newCost,
    max: req.body.newMax,
    remaining
  };
  const newDocName = req.body.newProductName.toLowerCase();
  await db.collection("Soda-Lineup").doc(`${docName}`).delete();
  await db.collection("Soda-Lineup").doc(`${newDocName}`).set(updatedSoda);
  res.status(200).send({
    "data": updatedSoda
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