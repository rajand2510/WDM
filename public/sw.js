self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: 'https://cdn-icons-png.flaticon.com/512/727/727399.png'
  });
});
