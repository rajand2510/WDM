const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:test@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const subscribers = [];

app.get('/vapidPublicKey', (req, res) => {
  res.send(vapidKeys.publicKey);
});

app.post('/subscribe', (req, res) => {
  subscribers.push(req.body);
  console.log('New Subscriber:', req.body);
  res.status(201).json({ message: 'Subscribed successfully' });
});

app.get('/send', (req, res) => {
  const payload = JSON.stringify({
    title: 'Are you feeling lazy?',
    message: 'Get up and do something productive!'
  });

  subscribers.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });

  res.send('Notifications sent!');
});

setInterval(() => {
  if (subscribers.length === 0) return;

  const payload = JSON.stringify({
    title: 'Reminder!',
    message: 'Are you feeling lazy? Let’s move! 💪'
  });

  subscribers.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });

  console.log('Notification sent!');
}, 10000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
