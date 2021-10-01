const express = require('express');
const router = express.Router();

const contactsOperations = require('../../model/index');
const { contactSchema } = require('../../schemas');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await contactsOperations.listContacts();
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
    const contactById = await contactsOperations.getContactById(contactId);
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
    const result = await contactsOperations.addContact(req.body);
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
    const newListContacts = await contactsOperations.removeContact(contactId);
    if (!newListContacts) {
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
    const result = await contactsOperations.updateContact(contactId, req.body);
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
