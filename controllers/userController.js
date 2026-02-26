// =====================
//  controller.js
//  This file has all the CRUD functions
//  CRUD = Create, Read, Update, Delete
// =====================

// This is our "database" — just an array stored in memory
// (data will reset when you restart the server)
let users = [];


// ---------- Helper function ----------
// Sends a JSON response back to the user
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// ---------- Helper function ----------
// Generates a simple unique ID like "abc123"
function generateId() {
  return Math.random().toString(36).slice(2, 9);
}


// =====================
//  READ - Get all users
//  GET /users
// =====================
function getAllUsers(req, res) {
  sendResponse(res, 200, users);
}


// =====================
//  READ - Get one user by ID
//  GET /users/:id
// =====================
function getOneUser(req, res, id) {
  // Find the user whose id matches
  const user = users.find(function (u) {
    return u.id === id;
  });

  if (!user) {
    sendResponse(res, 404, { message: "User not found" });
    return;
  }

  sendResponse(res, 200, user);
}


// =====================
//  CREATE - Add a new user
//  POST /users
//  Body: { "name": "Alice" }
// =====================
function createUser(req, res) {
  const name = req.body.name;

  // Make sure name was provided
  if (!name) {
    sendResponse(res, 400, { message: "Please provide a name" });
    return;
  }

  // Create the new user object
  const newUser = {
    id: generateId(),   // auto-generated ID
    name: name
  };

  users.push(newUser);  // add to our array

  sendResponse(res, 201, newUser);
}


// =====================
//  UPDATE - Change a user's name
//  PUT /users/:id
//  Body: { "name": "New Name" }
// =====================
function updateUser(req, res, id) {
  // Find the index of the user in the array
  const index = users.findIndex(function (u) {
    return u.id === id;
  });

  if (index === -1) {
    sendResponse(res, 404, { message: "User not found" });
    return;
  }

  const name = req.body.name;

  if (!name) {
    sendResponse(res, 400, { message: "Please provide a new name" });
    return;
  }

  // Update the name
  users[index].name = name;

  sendResponse(res, 200, users[index]);
}


// =====================
//  DELETE - Remove a user
//  DELETE /users/:id
// =====================
function deleteUser(req, res, id) {
  const index = users.findIndex(function (u) {
    return u.id === id;
  });

  if (index === -1) {
    sendResponse(res, 404, { message: "User not found" });
    return;
  }

  // Remove the user from the array
  const deletedUser = users.splice(index, 1)[0];

  sendResponse(res, 200, { message: "User deleted", user: deletedUser });
}


// Export all functions AND the users array
// (walletController needs the users array to check if a user exists)
module.exports = {
  users,           // <-- the array itself, so other files can read it
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser
};