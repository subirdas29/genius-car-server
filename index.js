const express = require('express');
const cors = require( 'cors');
const app = express();
const jwt = require('jsonwebtoken');
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
        const orderCollection = client.db('geniusCar').collection('orders');

        app.post('/jwt',(req,res)=>{
            const user = req.body;
            const token = jwt.sign( user ,process.env.ACCESS_TOKEN_SECRET, { expiresIn:'1h' } );
            res.send({token})
        })

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

        app.get('/orders',async(req,res)=>{
            let query = {}; //query update hobe tai let dhora hoise
            if(req.query.email)
            {
                query ={
                    email:req.query.email
                }
            }
            const cursor= orderCollection.find(query);
            const order = await cursor.toArray();
            res.send(order);
        })

        app.delete('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })


        app.patch('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            const status= req.body.status;
            const query = {_id:ObjectId(id)}
            const doc = {
                $set:{
                    status:status
                }
            } 
            const update = await orderCollection.updateOne(query,doc)
            res.send(update);
        })


        app.post('/orders',async(req,res)=>
        {
            const order = req.body;
            const result= await orderCollection.insertOne(order);
            res.send(result)

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
 

