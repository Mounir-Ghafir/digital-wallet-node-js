// =====================
//  server.js
//  This is the starting point of our app
//  Run it with: node server.js
// =====================

const http = require("http");  // built-in Node.js module to create a server
const router = require("./routes/routes.js");  // our router file

const PORT = 3000;

// Create the server
const server = http.createServer(function (req, res) {

  // Collect the request body (the data sent by the user)
  let body = "";

  req.on("data", function (chunk) {
    body += chunk;  // add each piece of data
  });

  req.on("end", function () {
    // When all data is received, parse it as JSON (if any)
    if (body) {
      req.body = JSON.parse(body);
    } else {
      req.body = {};
    }

    // Send the request to the router
    router(req, res);
  });

});

// Start listening
server.listen(PORT, function () {
  console.log("Server is running! Open: http://localhost:" + PORT);
});