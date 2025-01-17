var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

//------------------------------------------------------------------------------------------------
// CONFIGURATIONS
//------------------------------------------------------------------------------------------------

//Conf for sending access contro allow headers
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.use(express.json());

const app = express();

//const url = process.env.MONGOLAB_URI;
const url = "mongodb://mateo:mateo12345@ds229290.mlab.com:29290/macco_db";

//------------------------------------------------------------------------------------------------
// CALLBACKS
//------------------------------------------------------------------------------------------------

function postCallBack(bolso, resolve, reject) {
  const client = new MongoClient(url);
  let promise1 = client.connect();

  promise1.then(() => {

    const db = client.db("macco_db");
    const colBolsos = db.collection("bolsos");

    let promise2 = colBolsos.insertOne(bolso);
    promise2.then((res) => {
      client.close();
      resolve(res);
    });
    promise2.catch((err) => reject(err));
  })
}

function getCallBack(resolve, reject) {
  const client = new MongoClient(url);
  let promise1 = client.connect();

  promise1.then(() => {

    const db = client.db("macco_db");
    const colBolsos = db.collection("bolsos");

    let promise2 = colBolsos.find({}).toArray();
    promise2.then((bolsos) => {
      client.close();

      resolve(bolsos);
    });
    promise2.catch((err) => reject(err));
  });
}

function getByIdCallBack(id, resolve, reject) {
  const client = new MongoClient(url);
  let promise1 = client.connect();

  promise1.then(() => {

    const db = client.db("macco_db");
    const colBolsos = db.collection("bolsos");

    let o_id = new ObjectID(id);

    let promise2 = colBolsos.findOne({ "_id": o_id });
    promise2.then((bolso) => {
      client.close();

      resolve(bolso);
    });
    promise2.catch((err) => reject(err));
  });
}

function putCallBack(id, obj, resolve, reject) {
  const client = new MongoClient(url);
  let promise1 = client.connect();

  promise1.then(() => {

    const db = client.db("macco_db");
    const colBolsos = db.collection("bolsos");

    let o_id = new ObjectID(id);
    colBolsos.updateOne({ _id: o_id }, { $set: obj }, (err, res) => {
      if (err) {
        reject(res);
      }
      client.close();
      resolve(res);
    });
  });
}

function deleteCallBack(id, obj, resolve, reject) {
  const client = new MongoClient(url);
  let promise1 = client.connect();

  promise1.then(() => {

    const db = client.db("macco_db");
    const colBolsos = db.collection("bolsos");

    let o_id = new ObjectID(id);
    colBolsos.deleteOne({ _id: o_id }, (err, res) => {
      if (err) {
        reject(res);
      }
      client.close();
      resolve(res);
    });
  });
}

//------------------------------------------------------------------------------------------------
// SERVICES
//------------------------------------------------------------------------------------------------
router.get("/", (req, res) => {
  getCallBack(
    (bolsos) => res.json(bolsos),
    (err) => res.json(err)
  );
});

router.get("/:bolsoId", (req, res) => {
  let params = req.params;
  getByIdCallBack(
    params.bolsoId,
    (bolsos) => res.json(bolsos),
    (err) => res.json(err)
  );
});

router.post("", (req, res) => {
  let body = req.body;
  postCallBack(body,
    (bolso) => res.json(bolso),
    (err) => res.json(err)
  );
});

router.put("/:bolsoId", (req, res) => {
  let params = req.params;
  let body = req.body;

  putCallBack(params.bolsoId, body,
    (bolso) => res.json(bolso),
    (err) => res.json(err)
  );
});

router.delete("/:bolsoId", (req, res) => {
  let params = req.params;
  deleteCallBack(params.bolsoId,
    (bolso) => res.json(bolso),
    (err) => res.json(err)
  );
});

module.exports = router;