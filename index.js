// doing check when array is empty produces non stopping loop
// add database

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var json2html = require('node-json2html');


var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('view engine', 'pug');
app.set('views','./views');

var builders = [];


app.get('/api', function(req, res){
    return res.send("Welcome to St.Luke's Chapel Butabika Pledge tracking API");
});


app.get('/', function(req, res){
    // res.send("Welcome to St.Luke's Chapel Butabika Pledge tracking API");
	return res.render('index');
});


app.get('/private', function(req, res){
	return res.render('private');
});


app.post('/test', function(req, res){
    return res.send("Christ died for our sins, Let's help him build his fathers' house\n");
});


app.get('/add', function(req, res) {
	return res.render('add');
});

app.post('/add', function(req, res) {
    var name = req.body.name;
    var contact = req.body.contact;
    var pledged = req.body.pledged;
    var paid = req.body.paid;
    
    builders.push(req.body);

    // res.send(name + ' ' + contact + ' ' + pledged + ' ' + paid);
	return res.render('added');
});


app.get('/check', function(req, res) {
	return res.render('check');
});

app.post('/check', function(req, res) {
	// res.setHeader('Content-Type', 'application/json');
    
    var contact = req.body.contact;
    var arrayLength = builders.length;
	for (var i = 0; i < arrayLength; i++) {
	    if (builders[i].contact==contact){
	    // if (builders[i].includes(contact)){
	    	builder = builders[i];

		    var name = builder.name;
		    var contact = builder.contact;
		    var pledged = builder.pledged;
		    var paid = builder.paid;
	    
	    	return res.render('checked',  { name: name, contact: contact, pledged: pledged, paid: paid } );

	    } else {
	    	// res.render('check');
	    	// res.redirect(req.get('referer'));
	    };
  	
  	return res.send("Not Found!");

    // res.send(builder);
    // res.send(JSON.stringify({'builder': builder}));

}});


app.get('/update', function(req, res) {
	return res.render('update');
});

app.post('/update', function(req, res) {
	// res.setHeader('Content-Type', 'application/json');
    
    var contact = req.body.contact;
    var paid = parseInt(req.body.paid);

    var arrayLength = builders.length;
	for (var i = 0; i < arrayLength; i++) {
	    if (builders[i].contact==contact){
	    	builders[i].paid = parseInt(builders[i].paid);
	    	builders[i].paid += paid;
	    	paid = builders[i].paid

		    var name = builders[i].name;
		    var pledged = builders[i].pledged;
	    
	    	return res.render('checked',  { name: name, contact: contact, pledged: pledged, paid: paid } );

	    } else {
	    	// res.render('check');
	    	// res.redirect(req.get('referer'));
	    }
  	
  	return res.send("Not Found!");
    // res.send(builder);
    // res.send(JSON.stringify({'builder': builder}));
}});


app.get('/all', function(req, res){
	// res.setHeader('Content-Type', 'application/json');

    var arrayLength = builders.length;
    var total_pledge = 0;
    var total_paid = 0;
	for (var i = 0; i < arrayLength; i++) {
	    total_pledge = total_pledge + builders[i].pledged;
	   	total_paid += builders[i].paid;
	}

   // return res.send(JSON.stringify({'builders': builders, 
   // 							'total_pledge': total_pledge,
   // 							'total_paid': total_paid
   // 						}));


	var transform = {
					'<>':'tr', 
					'html': [
			                    {'<>':'th', "scope":"row", 'html':'${name}'},
			                    {'<>':'th','html':'${contact}'},
			                    {'<>':'th','html':'${pledged}'},
			                    {'<>':'th','html':'${paid}'}
			                ]
			        };
     
	var builders_html = json2html.transform(builders, transform);

    // res.send(builders);
    return res.render('all', {'builders_html': builders_html,
   							'total_pledge': total_pledge,
   							'total_paid': total_paid
			});

});



app.listen(3000);