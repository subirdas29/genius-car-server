const express = require('express');
const cors = require( 'cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()


//middle wares
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1mua1t2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 
async function run(){
    try{
        const serviceCollection = client.db('geniusCar').collection('services');
        app.get('/services',async(req,res)=>{
        const query = {} ;
        const cursor = serviceCollection.find(query);
        const result= await cursor.toArray();
        res.send(result);
        })

        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await serviceCollection.findOne(query);
            res.send(result);
            console.log(result)
            })

        
        

    }
    finally{

    }
}

run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('genius car server is running')
})

app.listen(port,()=>{
    console.log(`genius car server running on ${port}`)
} )
 

