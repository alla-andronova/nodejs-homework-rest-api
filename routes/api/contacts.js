const express = require('express');
const router = express.Router();

const { contacts: controller } = require('../../controllers');
module.exports = router;

router.get('/', controller.findAll);

router.get('/:contactId', controller.findById);

router.post('/', controller.addNewContact);

router.delete('/:contactId', controller.deleteContact);

router.put('/:contactId', controller.updateContact);

router.patch('/:contactId/favorite', controller.updateStatus);
