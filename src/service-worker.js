// push
self.addEventListener('push', function(event) {
  const message = JSON.parse(event.data.text())
  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      icon: message.icon || '/img/icons/android-chrome-192x192.png',
      click_action: message.url
    })
  )
})

workbox.core.setCacheNameDetails({ prefix: 'djing2-elui' })

// workbox.precaching.suppressWarnings()
workbox.core.clientsClaim()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
