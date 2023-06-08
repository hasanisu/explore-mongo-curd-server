const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('exploring curd')
})




const uri = "mongodb+srv://hasanIsu:hasan12345@cluster0.dkggbgt.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();
    const userCollection = await client.db("userMongoCurd").collection('users');

    app.get('/users', async (req, res) =>{
        const query = {};
        const cursor = userCollection.find(query);
        const users = await cursor.toArray();
        res.send(users) 
    })

    app.post('/users', async (req, res) =>{
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    })
    
  } finally {
   
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`exploring mongo curd on ${port}`)
})