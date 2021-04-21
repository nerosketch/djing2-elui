// push
self.addEventListener('push', event => {
  const message = JSON.parse(event.data.text())
  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      icon: message.icon || '/img/icons/android-chrome-192x192.png',
      click_action: message.url
    })
  )
})

const defurl = '/customers'
self.addEventListener('notificationclick', event => {
  const target = event.notification.data.click_action || defurl
  event.notification.close()

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(clientList => {
    for (const i = 0; i < clientList.length; i++) {
      const client = clientList[i];
      if (client.url == defurl && 'focus' in client) {
        return client.focus()
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(defurl)
    }
  }))
})

workbox.core.setCacheNameDetails({ prefix: 'djing2-elui' })

// workbox.precaching.suppressWarnings()
workbox.core.clientsClaim()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
