const fs = require('fs/promises');

const path = require('path');
const uniqid = require('uniqid');

const contactsPath = path.join(__dirname, './contacts.json');

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath, 'utf-8');
  return JSON.parse(contacts);
};

const getContactById = async contactId => {
  const contacts = await listContacts();

  const contactById = contacts.find(contact => contact.id === contactId);
  if (!contactById) {
    return null;
  }
  return contactById;
};

const removeContact = async contactId => {
  const contacts = await listContacts();

  const contactById = contacts.find(contact => contact.id === contactId);
  if (!contactById) {
    return null;
  }

  const newContacts = contacts.filter(contact => contact.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(newContacts));
  return newContacts;
};

const addContact = async body => {
  const contacts = await listContacts();
  const { name, email, phone } = body;
  const newContact = {
    name,
    email,
    phone,
    id: uniqid(),
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return await contacts;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();

  const idx = contacts.findIndex(item => item.id === contactId);
  console.log(idx);
  if (idx === -1) {
    return null;
  }
  const updateContact = { ...contacts[idx], ...body };
  contacts[idx] = updateContact;
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return updateContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
