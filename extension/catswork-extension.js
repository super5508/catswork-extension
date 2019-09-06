self.addEventListener('push', e => {
  const data = e.data.json();

  console.log('Notification received...', data);

  data.forEach(notification => {
    self.registration.showNotification('Activity Event', {
      body: notification.body,
      requireInteraction: true,
    });
  })
});