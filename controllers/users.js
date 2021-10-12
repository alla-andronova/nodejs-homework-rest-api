const bcrypt = require('bcryptjs');
const { Conflict, NotFound, BadRequest } = require('http-errors');
const { User } = require('../models');
const { userSchema } = require('../schemas');

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
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFound(`email ${email} not found`);
      // res.status(404).json({
      //   status: 'error',
      //   message: `email ${email} not found`,
      // });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequest('failed');
    }
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  // logout,
};
