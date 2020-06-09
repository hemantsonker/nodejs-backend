import express from 'express'
import bodyParser from 'body-parser'
import {MongoClient} from 'mongodb'
const app = express();
app.use(bodyParser.json());


const withMongoDb=async operations=>{
    try {
        const client=await MongoClient.connect(
            'mongodb://localhost:27017',
            {
                useNewUrlParser:true,
                useUnifiedTopology:true
            }
        )
        const db=client.db('articleDb');
        await operations(db);
        client.close();       
    } catch (error) {
        res.status(500).send({
            message: 'Database Error',
            error
        })
    }
}


const articlesInfo = {
    "learn-node": {
        upvotes: 0,
        comments:[]
    },
    "learn-react": {
        upvotes: 0,
        comments:[]
    },
    "learn-mongo": {
        upvotes: 0,
        comments:[]
    },
    "learn-javascript": {
        upvotes: 0,
        comments:[]
    }
}


app.get('/hello', (req, res) => {
    res.send('Hey there!!');
});

app.get('/hello/:name', (req, res) => {
    const name = req.params.name;
    return res.send(`Hello ${name}`);
});

app.post('/post', (req, res) => {
    const name = req.body.name;
    res.send(`Hello ${name} !!!!!`);
});

app.post('/api/articles/:name/upvote', (req, res) => {
    const name = req.params.name;
    articlesInfo[name].upvotes += 1;
    res.status(200).send(`Success!!!. Article ${name} has now ${articlesInfo[name].upvotes} upvotes`);
});

app.post('/api/articles/:name/add-comments',(req,res)=>{
    const name=req.params.name;
    const {comment}=req.body;
    articlesInfo[name].comments.push(comment);
    res.status(200).send(articlesInfo[name]);

})

app.listen(8000, () => {
    console.log("server is listening at port 8000");
});

