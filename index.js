const express = require('express');
const bodyParser = require('body-parser');

const port = 3000;

const {MongoClient, ObjectId} = require('mongodb');

const  app = express();

const mongoClient = new MongoClient('mongodb://127.0.0.1:27017');

app.use(express.static('public'));

app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    let books = [];

            try {
        await mongoClient.connect();
        const database = mongoClient.db('books-library-system');
        const booksCollection = database.collection('books');

         books = await booksCollection.find().toArray();

        await booksCollection.insertOne({
            name: 'javascript Book',
            price: '1000',
        });
        } catch (err) {
        console.log(err)
        } finally {
        await mongoClient.close();
    }

    res.render('dashboard', {
        books: books
    });
});

app.get('/new-book', (req,res) => {
    res.render('new-book');
});

app.post('/new-book', async (req, res) => {
    try {
        await mongoClient.connect();
        const database = mongoClient.db('books-library-system');
        const booksCollection = database.collection('books');

        await booksCollection.insertOne({
            book_name: req.body.book_name,
            book_author: req.body.book_author,
            price: req.body.book_price,
        });

    } catch (err) {
        console.log(err)
    } finally {
        await mongoClient.close();
    }
    res.redirect('/');

});

app.get('/delete', async (req, res) => {
    try {
        await mongoClient.connect();
        const database = mongoClient.db('books-library-system');
        const booksCollection = database.collection('books');

        await booksCollection.deleteOne({ _id: new ObjectId(req.query.id) });

    } catch (err) {
        console.log(err)
    } finally {
        await mongoClient.close();
    }
    res.redirect('/');

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
