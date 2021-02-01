// if (workbox) {
//   console.log(`Workbox is loaded`)
//   workbox.precaching.precacheAndRoute(self.__precacheManifest)
// } else {
//   console.log(`Workbox didn't load`)
// }

// push
self.addEventListener('push', function(event) {
  const message = JSON.parse(event.data.text())
  console.log('MSG:', message)
  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      icon: message.icon
    })
  )
})

workbox.core.setCacheNameDetails({ prefix: 'djing2-elui' })

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.suppressWarnings()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
