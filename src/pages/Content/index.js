/* eslint-disable no-undef */
import UserStorage from '../../configs/user-storage';
import { getCurrentPage } from '../../utils/page';
import { initFilterComment } from '../../utils/comment';
import { initAuthor } from '../../utils/profile';
import debug from '../../utils/debug';
import event from '../../utils/event';
const userStorage = new UserStorage();
// 1. read config
async function start() {
  const config = await userStorage.get();
  // 1.1 check is enabled
  if (config.enabled) {
    debug('init start');
    // eslint-disable-next-line no-undef
    chrome.runtime.onMessage.addListener(function(request) {
      // listen for messages sent from background.js
      if (request.type === 'urlChange') {
        // destroy all listener
        event.emit('unmount');
        init();
      }
    });

    chrome.runtime.sendMessage(
      {
        type: 'analytics',
        data: {
          hitType: 'event',
          eventCategory: 'run',
          eventAction: 'start',
          eventLabel: window.location.href,
        },
      },
      function(response) {
        debug('response %o', response);
      }
    );

    init();
  } else {
    debug('matters multer has turned off.');
  }
  function init() {
    // 2. get current page
    const [currentPage, pageParams] = getCurrentPage();
    // 3. handle
    switch (currentPage) {
      case 'detail':
        debug('detect detail page.');
        // if detail, handle comments list
        initFilterComment(config);

        break;

      case 'author':
        debug('detect author page.');

        initAuthor(pageParams, userStorage);

        break;
      default:
        debug('do not need handle.');
        break;
    }
    chrome.runtime.sendMessage(
      {
        type: 'analytics',
        data: {
          hitType: 'event',
          eventCategory: 'run',
          eventAction: 'init',
          eventLabel: window.location.href,
        },
      },
      function(response) {
        debug('response %o', response);
      }
    );
    setTimeout(() => {
      chrome.runtime.sendMessage(
        {
          type: 'analytics',
          data: {
            hitType: 'pageview',
            title: document.title,
            location: window.location.href,
            page: window.location.pathname,
          },
        },
        function(response) {
          debug('response %o', response);
        }
      );
    }, 2500);
  }
}

start();
