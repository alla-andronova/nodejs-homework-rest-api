const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const Jimp = require('jimp');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const jwt = require('jsonwebtoken');
const { Conflict, NotFound, BadRequest } = require('http-errors');
const dotenv = require('dotenv');
dotenv.config();
const { User } = require('../models');
const { userSchema } = require('../schemas');
const mailer = require('../nodemailer');

const { SECRET_KEY } = process.env;

const usersDir = path.join(__dirname, '../', 'public/avatars');

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
    const userAva = gravatar.url(email, { s: '200', r: 'pg', d: 'retro' });
    const verifyToken = uniqid();

    const newUser = {
      email,
      password: hashPassword,
      avatarURL: userAva,
      verifyToken,
    };
    const user = await User.findOne({ email });
    if (user) {
      throw new Conflict('already exist');
    }
    await User.create(newUser);

    const sendEmail = {
      to: email,
      from: 'allaitcreative@gmail.com',
      subject: 'verification',
      html: `<p>please follow link below </p>
            <a href="http://localhost:3000/api/users/verify/${verifyToken}" target="_blank" >click here</a>`,
    };
    await mailer(sendEmail);

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

const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempStorage, originalname } = req.file;
    const { id, email } = req.user;

    const user = await User.findOne({ id });

    const [extention] = originalname.split('.').reverse();
    const newFileName = `user_new-ava_${user.id}.${extention}`;

    Jimp.read(tempStorage, (err, image) => {
      if (err) throw err;
      image
        .resize(250, 250) // resize
        .write(newFileName); // save
    });

    const resultStorage = path.join(usersDir, newFileName);
    await fs.rename(tempStorage, resultStorage);

    const photo = path.join('/avatars', newFileName);

    await User.findByIdAndUpdate(
      user.id,
      {
        avatarURL: photo,
      },
      {
        new: true,
      },
    );

    res.json({
      message: 'success',
      code: 200,
      avatarURL: photo,
      email,
    });
  } catch (error) {
    console.log(error);
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
    if (!user.verify) {
      throw new BadRequest('email not verify');
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
const verification = async (req, res, next) => {
  try {
    const { verifyToken } = req.params;

    const user = await User.findOne({ verifyToken });

    if (!user) {
      throw new NotFound(' verify error');
    }
    await User.findByIdAndUpdate(user.id, {
      verifyToken: null,
      verify: true,
    });
    res.json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};

const repeatVerify = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { error } = userSchema.validate(req.body);

    if (error) {
      const err = new Error(error.message);
      err.status = 400;
      throw err;
    }

    if (!email) {
      throw new BadRequest('missing required field email');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFound(' please signup');
    }

    if (user.verify) {
      throw new BadRequest('Verification has already been passed"');
    }
    const sendEmail = {
      to: email,
      from: 'allaitcreative@gmail.com',
      subject: 'verification',
      html: `<p>please follow link below </p>
            <a href="http://localhost:3000/api/users/verify/${user.verifyToken}" target="_blank" >click here</a>`,
    };
    await mailer(sendEmail);

    res.json({
      status: 'success',
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
  updateAvatar,
  verification,
  repeatVerify,
};
