const skyward = require('skyward-rest');
const express = require('express')
const bodyParser = require('body-parser');  
const app = express()
const port = 3010;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.post('/', async (req, res) => { 
    console.log("It was hit!");
    const url = "https://skyward.alpinedistrict.org/scripts/wsisa.dll/WService=wsEAplus/seplog01";
    const username = req.body.username ? req.body.username : req.query.username;
    const password = req.body.password ? req.body.password : req.query.password;
    const term = req.body.term ? req.body.term : req.query.term;
    console.log(username, password);
    skyward(url)(username, password)
    .then(student => {
        student.scrape(term)
        .then((grades) => {
            res.send(grades);
        }).then(() => student.close());
    }).catch((e) => {
        res.send("Incorrect Credentials Man!");
    });

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));