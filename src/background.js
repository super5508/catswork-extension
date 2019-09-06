import { EnumActivity } from 'models/enums';
import config from './config';

import Status from 'services/Status';

chrome.runtime.onMessage.addListener(function(message) {
  if (message._type === 'addPerson') {
    chrome.storage.local.set({ person: message.person });
    chrome.browserAction.setBadgeText({ text: 'ADD' });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#fd6b54' });
  }
});

const publicVapidKey =
  'BLhTbgJzv9CCwMg5wXW8SSKfWwgABAkV6btg0QijZnEX7N8WAm_hkQ-R-fHjxxtGVXVr-PKpdGWEzeAVkWdymVk';

if ('serviceWorker' in navigator) {
  setInterval(() => {
    send();
  }, 60000)
}

async function send() {
  try {
    const status = await Status.status();
    const user = status.data.payload;

    const register = await navigator.serviceWorker.register(
      '../catswork-extension.js',
      {
        scope: '/',
      },
    );

    let serviceWorker;
    if (register.installing) {
      serviceWorker = register.installing;
    } else if (register.waiting) {
      serviceWorker = register.waiting;
    } else if (register.active) {
      serviceWorker = register.active;
    }

    if (serviceWorker) {
      if (serviceWorker.state === 'activated') {
        subscribe(register, user);
      }

      serviceWorker.addEventListener('statechange', e => {
        if (e.target.state === 'activated') {
          subscribe(register, user);
        }
      });
    }
  } catch (err) {
    alert(`send error: ${err}`);
  }
}

async function subscribe(register, user) {
  try {
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await fetch(`${config.server.url}subscribe`, {
      method: 'POST',
      body: JSON.stringify({ subscription, userId: user.userId }),
      headers: {
        'content-type': 'application/json',
      },
    });

  } catch (err) {
    alert(`subscribe error: ${err}`);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
