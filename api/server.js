const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json());

// Public folder is automatically handled by Vercel at /public

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:test@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const subscribers = [];

app.get('/api/vapidPublicKey', (req, res) => {
  res.send(vapidKeys.publicKey);
});

app.post('/api/subscribe', (req, res) => {
  subscribers.push(req.body);
  console.log('New Subscriber:', req.body);
  res.status(201).json({ message: 'Subscribed successfully' });
});

app.get('/api/send', (req, res) => {
  const payload = JSON.stringify({
    title: 'Are you feeling lazy?',
    message: 'Get up and do something productive!',
  });

  subscribers.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });

  res.send('Notifications sent!');
});

module.exports = app;
