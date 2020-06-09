import express from 'express'
import bodyParser from 'body-parser'
import {
    MongoClient
} from 'mongodb'
const app = express();
app.use(bodyParser.json());


const withMongoDb = async operations => {
    try {
        const client = await MongoClient.connect(
            'mongodb://localhost:27017', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        const db = client.db('articleDb');
        await operations(db);
        client.close();
    } catch (error) {
        res.status(500).send({
            message: 'Database Error',
            error
        })
    }
}


// const articlesInfo = {
//     "learn-node": {
//         upvotes: 0,
//         comments: []
//     },
//     "learn-react": {
//         upvotes: 0,
//         comments: []
//     },
//     "learn-mongo": {
//         upvotes: 0,
//         comments: []
//     },
//     "learn-javascript": {
//         upvotes: 0,
//         comments: []
//     }
// }


app.get('/hello', (req, res) => {
    res.send('Hey there!!');
});

app.get('/hello/:name', (req, res) => {
    const name = req.params.name;
    return res.send(`Hello ${name}`);
});


app.get('/api/articles/:name', async (req, res) => {
    const name = req.params.name;
    await withMongoDb(async db => {
        const articleInfo = await db.collection('articles').findOne({
            name: name
        });
        if (!articleInfo) {
            res.status(404).json({
                statusCode: '404',
                msg: 'Article not found'
            });
        } else {
            res.status(200).json(
                articleInfo
            );
        }
    });

});


app.post('/api/articles/:name/upvote', async (req, res) => {
    const articleName = req.params.name;

    await withMongoDb(async db => {
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        if(!articleInfo){
            res.status(404).send({
                msg:'Article not found'
            });
        }else{
            await db.collection('articles').updateOne({ name: articleName }, { '$set': {
                upvotes: articleInfo.upvotes + 1,
            }});
            const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
           /* res.status(200).json({
                status:'success',
                updatedArticleInfo
            })*/
			 res.status(200).json(updatedArticleInfo);
          
        }
    
    });
});

app.post('/post', (req, res) => {
    const name = req.body.name;
    res.send(`Hello ${name} !!!!!`);
});

app.post('/api/articles/:name/add-comments',async (req,res)=>{
    const articleName=req.params.name;
    const newComment = req.body.comment;
    await withMongoDb(async db=>{
        const articleInfo=await db.collection('articles').findOne({name:articleName});
        if(!articleInfo){
            res.status(404).send({
                msg:'Article not found'
            })
        }else{
            await db.collection('articles').updateOne({name:articleName},{'$set':{
                comments:articleInfo.comments.concat(newComment)
            }});

            const updatedArticleInfo=await db.collection('articles').findOne({name:articleName}); 

          /*  res.status(200).json({
                status:'success',
                statusCode:'200',
                updatedArticleInfo
            })*/
			 res.status(200).json(updatedArticleInfo);

        }

    })

});


// app.post('/api/articles/:name/add-comments', (req, res) => {
//     const name = req.params.name;
//     const {
//         comment
//     } = req.body;
//     articlesInfo[name].comments.push(comment);
//     res.status(200).send(articlesInfo[name]);
// })

app.listen(8000, () => {
    console.log("server is listening at port 8000");
});