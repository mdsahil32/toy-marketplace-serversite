const express = require('express');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
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
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const toyCollection = client.db('toyDB').collection('toy')

    await client.connect();



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
    const selectedToys = category.find(c => c.number ==  id)
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