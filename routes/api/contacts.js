const express = require('express');
const router = express.Router();

const { Contact } = require('../../models/index');
const { contactSchema, updateStatusSchema } = require('../../schemas');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.find({});
    res.json({
      message: 'success',
      contacts,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    // const contactById = await Contact.findOne({ _id: contactId });
    const contactById = await Contact.findById(contactId);
    if (!contactById) {
      const error = new Error(`Product with id=${contactId} not found`);
      error.status = 404;
      throw error;
    }
    res.json({
      message: 'success',
      contactById,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);

    if (error) {
      const err = new Error(error.message);
      err.status = 400;
      throw err;
    }
    const result = await Contact.create(req.body);
    res.status(201).json({
      message: 'success',
      code: 201,
      result,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      const error = new Error(`id ${contactId} not found`);
      error.status = 404;
      throw error;
    }
    res.json({
      message: 'success delete',
      code: 200,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);

    if (error) {
      const err = new Error(error.message);
      err.status = 400;
      throw err;
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      const error = new Error(`id ${contactId} not found`);
      error.status = 404;
      throw error;
    }
    res.json({
      message: 'success',
      code: 200,
      result,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { error } = updateStatusSchema.validate(req.body);

    if (error) {
      const err = new Error(error.message);
      err.status = 400;
      throw err;
    }
    const { contactId } = req.params;
    const { favorite } = req.body;
    const result = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      {
        new: true,
      },
    );
    if (!result) {
      const error = new Error(`id ${contactId} not found`);
      error.status = 404;
      throw error;
    }
    res.json({
      message: 'success',
      code: 200,
      result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
