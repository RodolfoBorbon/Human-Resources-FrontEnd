//controllers/userAuthentication.js

const bcrypt = require("bcrypt");
const oracledb = require("oracledb");
const dbModule = require('../oracledb'); // Import the oracledb module
const saltRounds = 10;

// Register new user
exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    let result = await dbModule.connection().execute(
      `INSERT INTO USERS(username, email, password) VALUES (:username, :email, :password) RETURNING id INTO :id`,
      {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      }
    );

    await dbModule.connection().commit();

    res.status(200).json({ message: "Registration successful." });
  } catch (err) {
    console.error(err);
    
    // Check for the unique constraint violation error code
    if (err.code === 'ORA-00001') {
      res.status(409).json({ message: "Username or email already exists. Please choose another." });
    } else {
      res.status(500).json({ message: "An error occurred during registration." });
    }
  }
};

// Login
exports.login = async (req, res) => {
  try {
    let result = await dbModule.connection().execute(
      `SELECT username, email, password FROM USERS WHERE username = :username`,
      { username: req.body.username }
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const user = result.rows[0];
    console.log(user);

    const match = await bcrypt.compare(req.body.password, user[2]);

    if(match) {
      req.user = user;
      res.status(200).json({ message: "Logged in successfully." });
    } else {
      res.status(400).json({ message: "Invalid username or password." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred during login." });
  }
};

// Logout
exports.logout = (req, res) => {
  req.logout();
  res.status(200).json({ message: "Logged out successfully." });
};
