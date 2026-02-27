let users = [];


function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}


function getAllUsers(req, res) {
  sendResponse(res, 200, users);
}


function getOneUser(req, res, id) {
  const user = users.find(function (u) {
    return u.id === id;
  });

  if (!user) {
    sendResponse(res, 404, { message: "User not found" });
    return;
  }

  sendResponse(res, 200, user);
}


function createUser(req, res) {
  const name = req.body.name;

  if (!name) {
    sendResponse(res, 400, { message: "Please provide a name" });
    return;
  }

  const newUser = {
    id: generateId(), 
    name: name
  };

  users.push(newUser); 

  sendResponse(res, 201, newUser);
}

function updateUser(req, res, id) {
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

  users[index].name = name;

  sendResponse(res, 200, users[index]);
}


function deleteUser(req, res, id) {
  const index = users.findIndex(function (u) {
    return u.id === id;
  });

  if (index === -1) {
    sendResponse(res, 404, { message: "User not found" });
    return;
  }

  const deletedUser = users.splice(index, 1)[0];

  sendResponse(res, 200, { message: "User deleted", user: deletedUser });
}

module.exports = {
  users,
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser
};