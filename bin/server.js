const app = require('../app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const { DB_HOST, PORT = 3000 } = process.env;

// const mailer = require('../nodemailer');

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log('success');
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err.message);
  });

// const email = {
//   to: 'JoraChemodan@meta.ua',
//   from: 'allaitcreative@gmail.com',
//   subject: 'Новая заявка с сайта',
//   html: `<p><strong>Email клиента:</strong> test@gmail.com</p>
//             <p><strong>Телефон клиента:</strong> 8-067 555-55-55</p>`,
// };

// mailer(email)
//   .then(() => console.log('Email success send'))
//   .catch(error => console.log(error.message));
