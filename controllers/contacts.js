const { Contact } = require('../models');
const { contactSchema, updateStatusSchema } = require('../schemas');

const findAll = async (req, res, next) => {
  try {
    const contacts = await Contact.find({});
    res.json({
      message: 'success',
      contacts,
    });
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
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
};

const addNewContact = async (req, res, next) => {
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
};

const deleteContact = async (req, res, next) => {
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
};

const updateContact = async (req, res, next) => {
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
};

const updateStatus = async (req, res, next) => {
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
};

module.exports = {
  findAll,
  findById,
  addNewContact,
  deleteContact,
  updateStatus,
  updateContact,
};
