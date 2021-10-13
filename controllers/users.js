const bcrypt = require('bcryptjs');
const { Conflict, NotFound, BadRequest } = require('http-errors');
const dotenv = require('dotenv');
dotenv.config();
const { User } = require('../models');
const { userSchema } = require('../schemas');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

const signup = async (req, res, next) => {
  try {
    const { error } = userSchema.validate(req.body);

    if (error) {
      const err = new Error(error.message);
      err.status = 400;
      throw err;
    }
    const { email, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const newUser = {
      email,
      password: hashPassword,
    };
    const user = await User.findOne({ email });
    if (user) {
      throw new Conflict('already exist');
      // res.status(409).json({
      //   status: 'error',
      //   code: 409,
      //   message: 'already exist',
      // });
      // return;
    }
    await User.create(newUser);
    res.status(201).json({
      status: 'success',
      code: 201,
      ResponseBody: {
        user: {
          email: email,
          subscription: 'starter',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = userSchema.validate(req.body);

    if (error) {
      const err = new BadRequest(error.message);
      throw err;
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFound(`email ${email} not found`);
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequest('failed');
    }
    const payload = {
      id: user.id,
    };
    const token = jwt.sign(payload, SECRET_KEY);
    await User.findByIdAndUpdate(user.id, { token });

    res.json({
      status: 'success',
      token,
      user: {
        email,
        subscription: 'starter',
      },
    });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findByIdAndUpdate(id, { token: null });
    if (!user.token) {
      res.status(401).json({
        status: 'error',
        message: 'not authorized',
        code: 401,
      });
    }
    res.status(204).json({
      status: 'success deleted',
    });
  } catch (error) {
    next(error);
  }
};

const getUserData = async (req, res, next) => {
  try {
    const { id, email, subscription } = req.user;
    const user = await User.findById(id);
    if (!user.token) {
      res.status(401).json({
        status: 'error',
        message: 'not authorized',
        code: 401,
      });
    }
    res.status(200).json({
      ResponseBody: {
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getUserData,
};
