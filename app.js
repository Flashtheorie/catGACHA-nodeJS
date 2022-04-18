// app.js
const express = require('express')
const app = express()
var helmet = require('helmet');
const mysql = require('mysql');
const session = require('express-session');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);



app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// launch views/index.html when / 
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// create a route to views/login.php
app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/views/login.html');
});
app.get('/catpicturesindex', function(req, res) {
	res.sendFile(__dirname + '/assets/img/cat1.png'); 
  });


  
app.get('/navbar', function(req, res) {
    res.sendFile(__dirname + '/views/include/navbar.php');
  });
  app.get('/navbarloggedin', function(req, res) {
    res.sendFile(__dirname + '/views/loggedin/include/navbar.html');
  });
  app.get('/profilview', function(req, res) {
    res.sendFile(__dirname + '/views/loggedin/profil.ejs');
  });
// Start the Express server






var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "roller24",
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    database : 'frenchyoutube'
  });

  app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {

		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username
				request.session.id = results[0].id;
				request.session.password = results[0].password;
				request.session.catfood = results[0].catfood;
				request.session.email = results[0].email;
				// Redirect to home page
				return response.redirect('../home', 200, {
					"username": request.session.username, 
					"catfood": request.session.catfood
					
				})
				
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			//response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// http://localhost:3000/home
app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// show the home page of logged users
		username = request.session.username
		catfood = request.session.catfood
		password  = request.session.password
		email = request.session.email
		var sql = "SELECT * FROM drops WHERE username = '"+ username + "' ORDER BY id DESC LIMIT 20";
		connection.query( sql, function ( err, resultSet ) {
			response.render('loggedin/index', {
                user: resultSet
            });
			
			
			
			//console.log(resultSet)
			
		
		});
        
		//response.end();
        
	} else {
		// Not logged in
		
		response.send('Please login to view this page! <a href="../login">login</a>');
	}
	//response.end();
});
app.get('/logout', function(request, response) {
	//request.logout();
	if (request.session.loggedin) {
	  request.session.destroy(function(err) {
		response.redirect('/');
	  });
	}
	else {
	  response.redirect('/login');
	}
  });


  app.get('/profil/:username', function(request, response) {
    // If the user is loggedin
    if (request.session.loggedin) {
        // show the home page of logged users
        username = request.session.username
        catfood = request.session.catfood
        password  = request.session.password
        email = request.session.email
		var sql = "SELECT * FROM drops WHERE username = '"+ username + "' ORDER BY id DESC LIMIT 20";
		connection.query( sql, function ( err, resultSet ) {
			response.render('loggedin/profil', {
                user: resultSet
				
            });
			
		});
          
    } else {
        // Not logged in
          
        response.send('Please login to view this page! <a href="../login">login</a>');
    }
});







// One drop, update the database of
app.get('/drop', function(request, response) {


	// If the user is loggedin
	if (request.session.loggedin) {











		// show the home page of logged users
		username = request.session.username
		catfood = request.session.catfood
		password  = request.session.password
		email = request.session.email
		var sql = "UPDATE accounts SET catfood = catfood - 1 WHERE username = '"+ username +"'";
		
		connection.query( sql, function ( err, resultSet ) {

			if ( err ) throw err;
		
			//console.log( resultSet );
			// Probability drops :

if( Math.random() < 0.5/100) {
    /* code that runs 0.5% of the time */
	let cat = "Lion";
	let img = "https://www.conservation-nature.fr/wp-content/uploads/2021/03/lion-600x450.jpg"
	var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		//
 			 });
}
else if( Math.random() < 5/100) {
    /* code that runs 0.5% of the time */
	let cat = "Turtle";
	let img ="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wussy_Pussy_on_wall.jpg/800px-Wussy_Pussy_on_wall.jpg"
	var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 10/100) {
    /* code that runs 0.5% of the time */
		let cat = "Ocicat";
		let img = "https://upload.wikimedia.org/wikipedia/commons/b/bc/Moosegrove_%C3%8Dcaro_Id%C3%ADlico%2C_JW_%28Ikaro%29_OCI_n_24_young_male_EX1_BIV_NOM.JPG"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 20/100) {
    /* code that runs 0.5% of the time */
		let cat = "Maine Coon";
		let img = "https://upload.wikimedia.org/wikipedia/commons/f/fd/Maincoooons.png"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 30/100) {
    /* code that runs 0.5% of the time */
		let cat = "Abyssinian";
		let img = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Kamee01.jpg/800px-Kamee01.jpg"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 50/100) {
    /* code that runs 0.5% of the time */
		let cat = "Alley Cat";
		let img = "https://upload.wikimedia.org/wikipedia/commons/9/93/Dachhase.jpg"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 25/100) {
    /* code that runs 0.5% of the time */
		let cat = "Burmese";
		let img = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Burmakatze-chocolate.JPG/800px-Burmakatze-chocolate.JPG"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 40/100) {
    /* code that runs 0.5% of the time */
		let cat = "Chartreux";
		let img = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Keijuhovin_Boromir_Ponteva_%28Porri%29_CHA_male_EX1_CAGPIB.jpg/1280px-Keijuhovin_Boromir_Ponteva_%28Porri%29_CHA_male_EX1_CAGPIB.jpg"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 12/100) {
    /* code that runs 0.5% of the time */
		let cat = "Bengal";
		let img = "https://upload.wikimedia.org/wikipedia/commons/9/9c/Stavenn_Felis_bengalensis_00.jpg"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 42/100) {
    /* code that runs 0.5% of the time */
		let cat = "Siamese";
		let img = "https://upload.wikimedia.org/wikipedia/commons/c/ca/Bluebell_2ans.jpg"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 7/100) {
    /* code that runs 0.5% of the time */
		let cat = "Persian";
		let img = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Chocolate_Persian.jpg/800px-Chocolate_Persian.jpg"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 17/100) {
    /* code that runs 0.5% of the time */
		let cat = "Ragdoll";
		let img = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Ragdoll%2C_seal_mitted.JPG/1280px-Ragdoll%2C_seal_mitted.JPG"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 1/100) {
    /* code that runs 0.5% of the time */
		let cat = "Scottish Fold";
		let img = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Scottish_Fold.jpg/1024px-Scottish_Fold.jpg"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 13/100) {
    /* code that runs 0.5% of the time */
		let cat = "American Shorthair";
		let img = "https://upload.wikimedia.org/wikipedia/commons/2/2a/Jewelkatz_Romeo_Of_Stalker-Bars.jpg"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 14/100) {
    /* code that runs 0.5% of the time */
		let cat = "Munchkin";
		let img = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Munchkin_chat.jpg/1280px-Munchkin_chat.jpg"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 15/100) {
    /* code that runs 0.5% of the time */
		let cat = "Himalayan";
		let img = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Sonny_Bunny.jpg/800px-Sonny_Bunny.jpg"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 17/100) {
    /* code that runs 0.5% of the time */
		let cat = "Siberian";
		let img = "https://upload.wikimedia.org/wikipedia/commons/0/06/Sibirische-Katze-Omega-1.jpg"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else if( Math.random() < 18/100) {
    /* code that runs 0.5% of the time */
		let cat = "Bombay";
		let img = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Bombay_femelle.JPG"
		var sql = "INSERT INTO drops (cat, username, img) VALUES ('"+ cat +"', '"+ username +"', '"+ img +"')";
  			connection.query(sql, function (err, result) {
    		if (err) throw err;
    		
 			 });
}
else{
	cat = "You did not drop anything"
}
			
			request.session.catfood = request.session.catfood - 1
			
			//response.redirect('loggedin/index')
			//console.log('catfood: ' + request.session.catfood)
			
			response.redirect(request.get('referer'));
		
		
		});
		
		//connection.end();
        
		//response.end();
		  
        
	} else {
		// Not logged in
		
		response.send('Please login to view this page! <a href="../login">login</a>');
	}
	//response.end();
});
app.listen(8081);