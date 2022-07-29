require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');

// App config **********************************************
var app = express();
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.render('pages/login');
})

app.get('/notes', (req, res) => {
    res.render('pages/notes')
})

app.listen(app.get('port'), () => {
  console.log(`Example app listening on port ${app.get('port')}`)
})