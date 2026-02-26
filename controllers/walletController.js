// =====================
//  walletController.js
//  CRUD functions for wallets
//  A wallet belongs to a user
// =====================

// We need the users array to check if a user exists
const usersController = require("./userController");

// Our wallets "database" — just an array in memory
let wallets = [];


// ---------- Helper function ----------
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// ---------- Helper function ----------
function generateId() {
  return Math.random().toString(36).slice(2, 9);
}


// =====================
//  READ - Get all wallets
//  GET /wallets
// =====================
function getAllWallets(req, res) {
  sendResponse(res, 200, wallets);
}


// =====================
//  READ - Get one wallet by ID
//  GET /wallets/:id
// =====================
function getOneWallet(req, res, id) {
  const wallet = wallets.find(function (w) {
    return w.id === id;
  });

  if (!wallet) {
    sendResponse(res, 404, { message: "Wallet not found" });
    return;
  }

  sendResponse(res, 200, wallet);
}


// =====================
//  CREATE - Add a new wallet
//  POST /wallets
//  Body: { "user_id": "abc123", "name": "My Wallet", "sold": 100 }
// =====================
function createWallet(req, res) {
  const user_id = req.body.user_id;
  const name    = req.body.name;
  const sold    = req.body.sold;

  // 1. Check that all fields are provided
  if (!user_id || !name || sold === undefined) {
    sendResponse(res, 400, { message: "Please provide user_id, name, and sold" });
    return;
  }

  // 2. Check that the user_id actually exists in the users array
  const userExists = usersController.users.find(function (u) {
    return u.id === user_id;
  });

  if (!userExists) {
    sendResponse(res, 404, { message: "No user found with this user_id. Create the user first!" });
    return;
  }

  // 3. Create the wallet
  const newWallet = {
    id: generateId(),   // auto-generated ID
    user_id: user_id,
    name: name,
    sold: sold
  };

  wallets.push(newWallet);

  sendResponse(res, 201, newWallet);
}


// =====================
//  UPDATE - Change a wallet
//  PUT /wallets/:id
//  Body: { "name": "New Name", "sold": 200 }
// =====================
function updateWallet(req, res, id) {
  const index = wallets.findIndex(function (w) {
    return w.id === id;
  });

  if (index === -1) {
    sendResponse(res, 404, { message: "Wallet not found" });
    return;
  }

  const name = req.body.name;
  const sold = req.body.sold;

  if (!name || sold === undefined) {
    sendResponse(res, 400, { message: "Please provide name and sold" });
    return;
  }

  // Update the fields (keep the same id and user_id)
  wallets[index].name = name;
  wallets[index].sold = sold;

  sendResponse(res, 200, wallets[index]);
}


// =====================
//  DELETE - Remove a wallet
//  DELETE /wallets/:id
// =====================
function deleteWallet(req, res, id) {
  const index = wallets.findIndex(function (w) {
    return w.id === id;
  });

  if (index === -1) {
    sendResponse(res, 404, { message: "Wallet not found" });
    return;
  }

  const deletedWallet = wallets.splice(index, 1)[0];

  sendResponse(res, 200, { message: "Wallet deleted", wallet: deletedWallet });
}


function deposit(req, res, id) {
  const index = wallets.findIndex(function (w) {
    return w.id === id;
  });

  if (index === -1) {
    sendResponse(res, 404, { message: "Wallet not found" });
    return;
  }

  const amount = req.body.amount;

  // amount must be a positive number
  if (!amount || amount <= 0) {
    sendResponse(res, 400, { message: "Please provide a positive amount to deposit" });
    return;
  }

  // Add the amount to the current sold
  wallets[index].sold = wallets[index].sold + amount;

  sendResponse(res, 200, {
    message: "Deposit successful",
    deposited: amount,
    new_sold: wallets[index].sold,
    wallet: wallets[index]
  });
}


// =====================
//  WITHDRAW - Remove money from a wallet
//  POST /wallets/:id/withdraw
//  Body: { "amount": 50 }
// =====================
function withdraw(req, res, id) {
  const index = wallets.findIndex(function (w) {
    return w.id === id;
  });

  if (index === -1) {
    sendResponse(res, 404, { message: "Wallet not found" });
    return;
  }

  const amount = req.body.amount;

  // amount must be a positive number
  if (!amount || amount <= 0) {
    sendResponse(res, 400, { message: "Please provide a positive amount to withdraw" });
    return;
  }

  // Cannot withdraw more than what is available
  if (amount > wallets[index].sold) {
    sendResponse(res, 400, {
      message: "Not enough money in the wallet",
      current_sold: wallets[index].sold,
      you_tried_to_withdraw: amount
    });
    return;
  }

  // Subtract the amount from the current sold
  wallets[index].sold = wallets[index].sold - amount;

  sendResponse(res, 200, {
    message: "Withdrawal successful",
    withdrawn: amount,
    new_sold: wallets[index].sold,
    wallet: wallets[index]
  });
}


module.exports = {
  getAllWallets,
  getOneWallet,
  createWallet,
  updateWallet,
  deleteWallet,
  deposit,
  withdraw
};