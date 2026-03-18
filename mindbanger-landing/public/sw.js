self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icon?size=192', // Use app icon
      badge: '/icon?size=96',  // Use app icon for badge
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: data.url || '/' // Default to root
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Mindbanger', options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Open the target URL when user clicks the notification
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
