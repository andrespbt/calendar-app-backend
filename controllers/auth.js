const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJwt } = require('../helpers/jwt.js');

// Create
const createUser = async (req, res = response) => {
  // Create user

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'User already exists with that email address',
      });
    }

    user = new User(req.body);

    // Encript password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    // Generate JWT
    const token = await generateJwt(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Please talk to administrator' });
  }
};

// Login
const loginUser = async (req, res = response) => {
  // Login User

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "User doesn't exists with that email address",
      });
    }

    // Confirm password
    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Invalid password',
      });
    }

    // Generate JWT
    const token = await generateJwt(user.id, user.name);

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

// Renew Token
const revalidateToken = async (req, res = response) => {
  const { uid, name } = req;

  // Generate jwt
  const token = await generateJwt(uid, name);

  res.json({
    ok: true,
    token,
  });
};

module.exports = { createUser, loginUser, revalidateToken };
