type SubscribeResponseCallback = (v: Response) => Response | PromiseLike<Response> | void
type ShowMessageCallback = (message: string) => void

export default class PushNotificationsClass {
  private isPushEnabled = false
  private registration?: ServiceWorkerRegistration
  private VAPID_KEY = 'BFeowi8N_dBBpJRIECUv-gu5ckTEP-W0CjjuzbMBbnTnfekbXsH3W_smTU37VgleRt7ry_q9eo6UD7vNngxXHcc'
  private showMsgCallback?: ShowMessageCallback

  constructor(showMsgCallback?: ShowMessageCallback) {
    this.showMsgCallback = showMsgCallback
    // Do everything if the Browser Supports Service Worker
    if ('serviceWorker' in navigator) {
      const serviceWorker = 'service-worker.js'
      navigator.serviceWorker.register(serviceWorker).then(reg => {
        this.registration = reg
        this.initialiseState(reg)
      })
    } else {
      // If service worker not supported, show warning to the message box
      this.showMessage('Service Worker is not supported in your Browser!')
    }
  }

  public toggleSubscribe() {
    if (this.isPushEnabled) {
      return this.unsubscribe(this.registration)
    }
    return this.subscribe(this.registration)
  }

  // Once the service worker is registered set the initial state
  private initialiseState(reg: ServiceWorkerRegistration) {
    // Are Notifications supported in the service worker?
    if (!(reg.showNotification)) {
      // Show a message and activate the button
      // subBtn.textContent = 'Subscribe to Push Messaging'
      this.showMessage('Showing Notification is not suppoted in your browser')
      return
    }

    // Check the current Notification permission.
    // If its denied, it's a permanent block until the
    // user changes the permission
    if (Notification.permission === 'denied') {
      // Show a message and activate the button
      // subBtn.textContent = 'Subscribe to Push Messaging'
      // subBtn.disabled = false
      this.showMessage('The Push Notification is blocked from your browser.')
      return
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
      // Show a message and activate the button
      // subBtn.textContent = 'Subscribe to Push Messaging'
      // subBtn.disabled = false
      this.showMessage('Push Notification is not available in the browser')
      return
    }

    // We need to get subscription state for push notifications and send the information to server
    reg.pushManager.getSubscription().then(subscription => {
      if (subscription) {
        this.postSubscribeObj('subscribe', subscription, response => {
          // Check the information is saved successfully into server
          if (response.status === 201) {
            // Show unsubscribe button instead
            // subBtn.textContent = 'Unsubscribe to Push Messaging'
            // subBtn.disabled = false
            this.isPushEnabled = true
            this.showMessage('Successfully subscribed for Push Notification')
          }
        })
      }
    })
  }

  private showMessage(message: string) {
    // const messageBox = document.getElementById('webpush-message')
    if (this.showMsgCallback) {
      this.showMsgCallback(message)
      // messageBox.textContent = message
      // messageBox.style.display = 'block'
    }
  }

  private subscribe(reg?: ServiceWorkerRegistration) {
    if (!reg) return

    // Get the Subscription or register one
    reg.pushManager.getSubscription().then(subscription => {
      const applicationServerKey = this.VAPID_KEY
      let options = {}
      // Check if Subscription is available
      if (subscription) {
        return subscription
      }

      options = {
        userVisibleOnly: true,
        applicationServerKey: this.urlB64ToUint8Array(applicationServerKey)
      }
      // If not, register one
      reg.pushManager.subscribe(options)
        .then(subscription => {
          this.postSubscribeObj('subscribe', subscription, response => {
            // Check the information is saved successfully into server
            if (response.status === 201) {
              // Show unsubscribe button instead
              // subBtn.textContent = 'Unsubscribe to Push Messaging'
              // subBtn.disabled = false
              this.isPushEnabled = true
              this.showMessage('Successfully subscribed for Push Notification')
            }
          })
        })
        .catch(err => {
          console.log('Subscription error:', err)
        })
    })
  }

  private urlB64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  private unsubscribe(reg?: ServiceWorkerRegistration) {
    if (!reg) return

    // Get the Subscription to unregister
    reg.pushManager.getSubscription()
      .then(subscription => {
        // Check we have a subscription to unsubscribe
        if (!subscription) {
          // No subscription object, so set the state
          // to allow the user to subscribe to push
          this.showMessage('Subscription is not available')
          return
        }
        this.postSubscribeObj('unsubscribe', subscription, response => {
          // Check if the information is deleted from server
          if (response.status === 202) {
            // Get the Subscription
            // Remove the subscription
            subscription.unsubscribe()
              .then(() => {
                // subBtn.textContent = 'Subscribe to Push Messaging'
                this.showMessage('Successfully unsubscribed for Push Notification')
                this.isPushEnabled = false
                // subBtn.disabled = false
              }).catch(() => {
                // subBtn.textContent = 'Unsubscribe to Push Messaging'
                this.showMessage('Error during unsubscribe from Push Notification')
                // subBtn.disabled = false
              })
          }
        })
      }
      )
  }

  private postSubscribeObj(statusType: string, subscription: PushSubscription, callback: SubscribeResponseCallback) {
    // Send the information to the server with fetch API.
    // the type of the request, the name of the user subscribing,
    // and the push subscription endpoint + key the server needs
    // to send push messages

    let browser: string | null = null
    const rt = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)
    if (rt) {
      browser = rt[0].toLowerCase()
    }

    const data = { status_type: statusType,
      subscription: subscription.toJSON(),
      browser: browser,
      group: 'group_name'
    }

    fetch('/webpush/save_information', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    }).then(callback)
  }
}
