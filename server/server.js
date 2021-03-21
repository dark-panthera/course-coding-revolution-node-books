const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(`${__dirname}/../public`));
app.use(bodyParser.json());

// DB

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};
let url = 'mongodb+srv://Panthera:Bernice-77@cluster0.aougs.mongodb.net/book_db?retryWrites=true&w=majority';
mongoose.connect(url);
// mongoose.connect('mongodb://localhost:27017/book_db');

const { Book } = require('./models/books');
const { Store } = require('./models/stores');

// POST
app.post('/api/add/store', (req, res) => {
    const store = new Store({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    });

    store.save((err, doc) => {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).send();
    });
});

app.get('/api/stores', (req, res) => {
    Store.find({}, (err, doc) => {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).send(doc);
    })
})

// POST
app.post('/api/add/books', (req, res) => {
    const book = new Book({
        name: req.body.name,
        author: req.body.author,
        pages: req.body.pages,
        price: req.body.price,
        stores: req.body.stores
    });

    book.save((err, doc) => {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).send();
    });
});

app.get('/api/books', (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let order = req.query.ord ? req.query.ord : 'asc';

    Book.find().sort({
        _id: order
    }).limit(limit).exec((err, doc) => {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).send(doc);
    })
})

app.get('/api/books/:id', (req, res) => {
    let id = req.params.id;

    Book.findById(id, (err, doc) => {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).send(doc);
    })
})

// PATCH
app.patch('/api/add/books/:id', (req, res) => {
    let id = req.params.id;

    Book.findByIdAndUpdate(id,
        {
            $set: req.body
        },
        { new: true },
        (err, doc) => {
            if (err) {
                res.status(400).send(err);
            }
            res.status(200).send(doc);
        }
    );
});

// DELETE
app.delete('/api/delete/books/:id', (req, res) => {
    let id = req.params.id;

    Book.findByIdAndRemove(id,
        (err, doc) => {
            if (err) {
                res.status(400).send(err);
            }
            res.status(200).send();
        }
    );
});


////// ---------- PORT ---------- //////
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Started at port ${port}`);
});
