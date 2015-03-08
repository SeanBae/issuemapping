var express = require('express');
var router = express.Router();


/*
 * GET users with matching hashkeys
 */
router.get('/login/:fullname/:password', function(req, res) {
	var db = req.db;
	db.collection('userlist').find({fullname:req.params.fullname,password:req.params.password}).toArray(function (err, items) {
	    res.send({
	      retStatus : (items.length != 0 ? 'Success' : 'No matching login found'),
	      redirectTo: '/map'
	    });
    });
});

/*
 * GET users with matching hashkeys
 */
router.get('/register', function(req, res) {
	var db = req.db;
	db.collection('hashkeylist').find({key:req.params.hashkey}).toArray(function (err, items) {
	    if(items.length != 0) {
	    	//it is a valid, unused hashkey
	    	//add the user
	    	db.collection('userlist').insert(req.body, function(err, result){
		        res.send(
		            (err === null) ? { msg: '' } : { msg: err }
		        );
		    });
	    	//remove the hashkey from the list
	    } else {
	    	res.send({
	    		msg: 'Invalid hashkey.'
	    	})
	    }
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser/:hashkey', function(req, res) {
    var db = req.db;
	db.collection('hashkeylist').find({key: String(req.body.hashkey)}).toArray(function (err, items) {
	    console.log(items);
	    if(items.length != 0) {
	    	//it is a valid, unused hashkey
	    	//add the user
	    	db.collection('userlist').insert(req.body, function(err, result){
		        db.collection('hashkeylist').remove({key: Number(req.body.hashkey)}, function(err) {
			        res.send({
			            redirectTo: '/map',
			            msg: ''
			        });
		        });
		    });
	    	//remove the hashkey from the list
	    } else {
	    	res.send({
	    		msg: 'Invalid hashkey.'
	    	})
	    }
    });
});

module.exports = router;
