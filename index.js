const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    app.get('/users/:id', async (req, res) =>{ //for update user or find specific user
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const user = await userCollection.findOne(query);
      console.log(user);
      res.send(user);
    })

    app.post('/users', async (req, res) =>{
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    });

    app.put('/users/:id', async (req, res) =>{  // for update user 
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const user = req.body;
      const options = {upsert : true};
      const updatedUser = {
        $set:{
          name: user.name,
          address: user.address,
          email: user.email

        }
      }
      const result = await userCollection.updateOne(filter, updatedUser, options)
      res.send(result)

    })

    app.delete('/users/:id', async (req, res)=>{
      const id = req.params.id;
      // console.log('deleting process ongoing', id);
      const query = { _id:new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      console.log(result);
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