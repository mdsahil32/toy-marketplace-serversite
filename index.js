const express = require('express');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
const category = require('./CategoryData/Data.json')

// middleWare 
app.use(cors())
app.use(express.json())

// 
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.6wm6qxp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
 
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const toyCollection = client.db('toyDB').collection('toy')

    app.get('/addToy', async (req, res) => {
      const cursor = toyCollection.find().limit(20)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/addToy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query)
      res.send(result)
    })

    app.post('/addToy', async (req, res) => {
      const addToys = req.body;
      // console.log(addToys);
      const result = await toyCollection.insertOne(addToys);
      res.send(result)
    })

    app.put('/addToy/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateToy = req.body;
      const toy = {
        $set:{
          price:updateToy.price,
          quantity:updateToy.quantity,
          detail:updateToy.detail
        }
      }
      const result = await toyCollection.updateOne(filter, toy, options)
      res.send(result)
    })

    app.delete('/addToy/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toyCollection.deleteOne(query)
      res.send(result);
    })

    // Search Option -- ----//
    const indexKeys = { name: 1 };
    const indexOptions = { name: "name" }

    const result = await toyCollection.createIndex(indexKeys, indexOptions)

    app.get('/toySearchByName/:text', async (req, res) => {
      const searchText = req.params.text;
      const result = await toyCollection.find({
        $or: [
          { name: { $regex: searchText, $options: "i" } }
        ],
      })
        .toArray();
      res.send(result)
    })
    // end-----

    // set user email data ----

    app.get('/myToys/:email', async (req, res) => {
      const result = await toyCollection.find({ sellerEmail: req.params.email}).toArray()
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// 
app.get('/', (req, res) => {
  res.send('hero toys server is running')
})

app.get('/category', (req, res) => {
  res.send(category)
})

app.get('/toys/:id', (req, res) => {
  const id = req.params.id;
  const selectedToys = category.find(c => c.number == id)
  res.send(selectedToys)
})

app.get('/category/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const actionHero = category.filter(c => c.id == id)
  res.send(actionHero)
})

app.listen(port, () => {
  console.log(`running on port ${port}`);
})