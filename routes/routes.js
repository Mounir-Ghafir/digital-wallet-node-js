// =====================
//  router.js
//  This file decides which function to call
//  based on the URL and the HTTP method
// =====================

const userController   = require("../controllers/userController");
const walletController = require("../controllers/walletController");

function router(req, res) {

  const method = req.method;   // GET, POST, PUT, DELETE
  const url    = req.url;      // e.g. /users  or  /wallets/abc123


  // ==============================
  //  USER ROUTES
  // ==============================

  if (url === "/users" && method === "GET") {
    userController.getAllUsers(req, res);

  } else if (url === "/users" && method === "POST") {
    userController.createUser(req, res);

  } else if (url.startsWith("/users/") && method === "GET") {
    const id = url.split("/")[2];
    userController.getOneUser(req, res, id);

  } else if (url.startsWith("/users/") && method === "PUT") {
    const id = url.split("/")[2];
    userController.updateUser(req, res, id);

  } else if (url.startsWith("/users/") && method === "DELETE") {
    const id = url.split("/")[2];
    userController.deleteUser(req, res, id);


  // ==============================
  //  WALLET ROUTES
  // ==============================

  } else if (url === "/wallets" && method === "GET") {
    walletController.getAllWallets(req, res);

  } else if (url === "/wallets" && method === "POST") {
    walletController.createWallet(req, res);

  } else if (url.startsWith("/wallets/") && method === "GET") {
    const id = url.split("/")[2];
    walletController.getOneWallet(req, res, id);

  } else if (url.startsWith("/wallets/") && method === "PUT") {
    const id = url.split("/")[2];
    walletController.updateWallet(req, res, id);

  } else if (url.startsWith("/wallets/") && method === "DELETE") {
    const id = url.split("/")[2];
    walletController.deleteWallet(req, res, id);


  // POST /wallets/:id/deposit
  } else if (url.match(/^\/wallets\/[^/]+\/deposit$/) && method === "POST") {
    const id = url.split("/")[2];
    walletController.deposit(req, res, id);

  // POST /wallets/:id/withdraw
  } else if (url.match(/^\/wallets\/[^/]+\/withdraw$/) && method === "POST") {
    const id = url.split("/")[2];
    walletController.withdraw(req, res, id);


  // ==============================
  //  NO MATCHING ROUTE
  // ==============================

  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Page not found" }));
  }

}

module.exports = router;