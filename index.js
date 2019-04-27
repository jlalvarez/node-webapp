var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var db; // no necesaria

var mongoose = require('mongoose');
var urlmongo = 'mongodb://mongo/linkdb';
mongoose.connect(urlmongo, { useNewUrlParser: true }, function(err, dbmongo) {
     if (err) { 
        console.log("Error: " + err);//throw err;
     } else {
        db = dbmongo;
        console.log("Conectado...");
     }
     //db.close();
});

var linkSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    url: String,
    description: String
});
var Link = mongoose.model('Link', linkSchema);

app.set('view engine', 'ejs');


//app.use(express.static('static'));
//app.get('/', function (req, res) {
//   res.sendFile( __dirname + "/" + "index.html" );
//});
app.get('/', function (req, res) {
    
     Link.find(function (err, links){
        if (err) return console.log(err);
        // renders index.ejs
        res.render('index.ejs', {'links': links});
    });
    

});

var router = express.Router();
app.use('/api', router);

router.get('/test', function (req, res) {
   res.send('Hello World');
});

var link_list = function (req, res) {
    Link.find(function (err, links){
        if(err) return res.send({message: 'Error en el servidor'});
        
        if(links){
            res.json({'links': links});
        }else{
            return res.status(404).send({
                message: 'No hay links'
            });
        }
    });
};
router.get('/list',link_list);

var link_create = function (req, res) {
    var l = new Link(
        {
           _id: new mongoose.Types.ObjectId(),
            url: req.body.url,
            description: req.body.description
        }
    );

    l.save(function (err) {
        if (err) {
            res.send('<p>ERROR: Link Not Created</p><a href="">Volver</a>');
        } else {
            res.send('Link Created successfully - <a href="/">Volver</a>'); 
            console.log('Link: ' + l.url + ' Created successfully');
        }
    });
};
router.post('/create', urlencodedParser, link_create);


var link_delete = function (req, res) {
    Link.findByIdAndRemove(req.params.id, function (err) {
        if (err) res.send('<p>ERROR: Link Not Deleted</p><a href="">Volver</a>');
        else {
            res.send('Deleted successfully! - <a href="/">Volver</a>');
            console.log('Link: ' + req.params.id + ' deleted successfully');
        }
    });
};
router.get('/delete/:id', link_delete);

var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port);
});