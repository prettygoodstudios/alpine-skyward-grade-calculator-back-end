const skyward = require('skyward-rest');
const express = require('express')
const bodyParser = require('body-parser');  
const app = express()
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
      //respond with 200
      res.send(200);
    }
    else {
    //move on
      next();
    }
});

app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
  });

app.post('/', (req, res) => {
    const url = "https://skyward.alpinedistrict.org/scripts/wsisa.dll/WService=wsEAplus/seplog01";
    const username = req.body.username ? req.body.username : req.query.username;
    const password = req.body.password ? req.body.password : req.query.password;
    const term = req.body.term ? req.body.term : req.query.term;
    skyward(url)(username, password)
    .then(student => {
        student.scrape(term)
        .then((grades) => {
            res.send(grades);
        }).then(() => student.close());
    }).catch((e) => {
        res.send({error: e});
    });
});

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));