const saltedMd5 = require('salted-md5');
const mysql = require('mysql2');

const port = process.env.PORT || 3000;
const salt = process.env.SALT || 'sdhgf45?'
const app = require('fastify')({
    logger:true,
    requestTimeout: 30000,
});

app.register(require('@fastify/cors'), {
    origin: '*',
    methods: ['GET', 'POST']
});



// create a new MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'thebigbang122',
    database: 'urlDB'
  });
  // connect to the MySQL database
  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL database:', error);
    } else {
      console.log('Connected to MySQL database!');
    }
  });
  
  // close the MySQL connection
  //connection.end();

app.post("/shorten/:url", async function(request, response) {
    console.log(request.params);
    await saltedMd5(request.params.url, salt, true).then(
        (saltedURL) => {
            const sURLHash = saltedURL.substr(saltedURL.length - 7);
            const sURL = `http://localhost:3000/${sURLHash}`;

            connection.query(
                `INSERT INTO urlDB.urlMAP (URL_hash, URL_string, sURL) VALUES (?, ?, ?);`,
                [sURLHash, request.params.url, sURL],
                (err, result) => {
                   if(err!=null){
                    console.log("here");
                       response.status(400).send(err);
                    }
                    
                    request.log.info(`url data successfully inserted in DB`, result);
                }
                );
                
                response.status(200).send(sURL);
            // response.send(sURLHash);
        }
    )
});

app.get("/:urlHash", function(request, response) {
    
    connection.query(
        `SELECT URL_string FROM urlDB.urlMAP WHERE urlDB.urlMAP.URL_hash = (?)`,
        [request.params.urlHash],
        (err, result) => {
            const url = JSON.stringify(result);
            const [{URL_string}] = result
            const expandedURL = `https://${URL_string}`;
            
            response.code(303).redirect(302, expandedURL);
        }
    );
});

app.get("/", function (request, response) {
    request.log.info("something happened");
    response.send("Hello, world!");
});


app.listen({port}, (err, address) => {
    if(err){
        app.log.error(err);
        process.exit(1);
    }

    app.log.info(`Fastify is listening on port: ${port}`);

});