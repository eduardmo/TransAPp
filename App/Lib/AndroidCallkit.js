/**
 * Class specifically for IOS
 * we need some sort of encapsulation since this only work for IOS
 */
import FCM from 'react-native-fcm'

export default class AndroidCallKit {
  // Ending the call
  endCall (uuid = String) {
    FCM.removeAllDeliveredNotifications()
  }

  // We should able to display incomming call here.
  displayIncomingCall (uuid = String, title = String) {
    // console.tron.log(1)
    FCM.presentLocalNotification({
      id: uuid,                               // (optional for instant notification)
      title: 'Someone is calling',                     // as FCM payload
      body: 'My Notification Message',                    // as FCM payload (required)
      sound: 'default',                                   // as FCM payload
      priority: 'high',                                   // as FCM payload
      click_action: 'fcm.ACTION.ANSWER',                             // as FCM payload
      badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
      number: 10,                                         // Android only
      ticker: 'My Notification Ticker',                   // Android only
      auto_cancel: true,                                  // Android only (default true)
      large_icon: 'ic_launcher',                           // Android only
      icon: 'ic_launcher',                                // as FCM payload, you can relace this with custom icon you put in mipmap
      big_text: 'Show when notification is expanded',     // Android only
      sub_text: 'This is a subText',                      // Android only
      color: 'red',                                       // Android only
      vibrate: 300,                                       // Android only default: 300, no vibration if you pass null
      tag: 'some_tag',                                    // Android only
      group: 'group',                                     // Android only
      picture: 'https://google.png',                      // Android only bigPicture style
      lights: true,                                       // Android only, LED blinking (default false)
      show_in_foreground: true                                  // notification when app is in foreground (local & remote)
    })
  }

  // WE will have listeners for what is the output
  addEventListener (event = String, fn = Function) {
  }
}
