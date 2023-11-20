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
// app.register(require('@fastify/mysql'), {
//     connectionString: 'mysql://root@localhost/mysql'
// })


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
            
            connection.query(
                `INSERT INTO urlDB.urlMAP (URL_hash, URL_string) VALUES (?, ?);`,
                [sURLHash, request.params.url],
                (err, result) => {
                   console.log(err, result);
                }
              );
            
            response.send(sURLHash);
        }
    )
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