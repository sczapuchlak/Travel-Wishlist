var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;



// "Database". Names of places, and whether the user has visited it or not.

//var places = [
//{id: "1", name: "Rome", visited: true},
//{id: "2", name: "New York", visited: false},
//{id: "3", name: "Tokyo", visited: false}
//];
//var counter = places.length;

function findID(obj) {
    obj.id = obj._id;
    delete obj._id;
    return obj;
}

function useID(obj) {
    obj._id = ObjectID(obj.id);
    delete obj.id;
    return obj;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    req.db.collection('travel').find().toArray(function (err, places)
    {
        if (err) {
            return next(err)
        }
        return res.render('index', {layout: 'layout', title: 'Travel Wish List'});
    });
});


/* GET all items home page. */
router.get('/all', function(req, res) {

   // router.get('/all', function(req, res) {
       // res.json(places);
    //});



    req.db.collection('travel').find().toArray(function (err, places)
    {
        if (err) {
            return next(err)
        }
        res.json(places.map(findID));
    });
});


/* POST - add a new location */
router.post('/add', function(req, res, next) {
    //var name = req.body.name;
   // var place = { 'id': ++counter + "" , 'name': name, 'visited': false };


    //places.push(place);

    req.db.collection('travel').insertOne(req.body, function(err){
        if (err) {
            return next(err);
        }
        res.status(201);      // Created
        res.json(findID(req.body));      // Send new object data back as JSON, if needed.

    });
});


/* PUT - update whether a place has been visited or not */
router.put('/update', function(req, res, next){
    var update = { $set : { visited : req.body.visited == "true" }};  // all the body parameters are strings
    req.db.collection('travel').findOneAndUpdate(useId(req.body), update, function(err, place)
    {
        if (err) {
            return next(err);
        }
        res.json(translateId(place));
    });
});

//delete button working
//removes from database
router.delete('/delete', function(req, res, next){

    req.db.collection('travel').remove(useID(req.body), function(err){
        if (err) {
            return next(err);
        }
        res.status(200);
        res.json(findID(req.body));
    });

});



module.exports = router;