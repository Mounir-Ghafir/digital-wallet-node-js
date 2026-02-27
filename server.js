const http = require("http"); 
const router = require("./routes/routes.js"); 

const PORT = 3000;

const server = http.createServer(function (req, res) {

  let body = "";

  req.on("data", function (chunk) {
    body += chunk;  
  });

  req.on("end", function () {
    if (body) {
      req.body = JSON.parse(body);
    } else {
      req.body = {};
    }

    router(req, res);
  });

});


server.listen(PORT, function () {
  console.log("Server is running! Open: http://localhost:" + PORT);
});