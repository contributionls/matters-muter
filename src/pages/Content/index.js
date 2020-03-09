/* eslint-disable no-undef */
import '../../utils/entry';
import UserStorage from '../../configs/user-storage';
import { getCurrentPage } from '../../utils/page';
import { initFilterComment, initHandleNoLoginOuter } from '../../utils/comment';
import { initAuthor } from '../../utils/profile';
import debug from '../../utils/debug';
import event from '../../utils/event';
const userStorage = new UserStorage();
let GLOBAL_COOMMENT_RESPONSE_REQUEST_COMPLETE_CALLBACK = [];
// 1. read config
async function start() {
  const config = await userStorage.get();
  // 1.1 check is enabled
  if (config.enabled) {
    debug('init start');
    // eslint-disable-next-line no-undef
    browser.runtime.onMessage.addListener(function(request) {
      // listen for messages sent from background.js
      if (request.type === 'urlChange') {
        // destroy all listener
        event.emit('unmount');
        init();
      }
      if (request.type === 'commentsComplete') {
        if (GLOBAL_COOMMENT_RESPONSE_REQUEST_COMPLETE_CALLBACK.length > 0) {
          GLOBAL_COOMMENT_RESPONSE_REQUEST_COMPLETE_CALLBACK.forEach((func) => {
            func && func();
          });
          GLOBAL_COOMMENT_RESPONSE_REQUEST_COMPLETE_CALLBACK = [];
        } else {
          initFilterComment(config);
        }
      }
    });

    browser.runtime.sendMessage(
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

    // version

    browser.runtime.sendMessage(
      {
        type: 'analytics',
        data: {
          hitType: 'event',
          eventCategory: 'version',
          eventAction: __CURRENT_VERSION__,
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

        GLOBAL_COOMMENT_RESPONSE_REQUEST_COMPLETE_CALLBACK.push(() => {
          initFilterComment(config);
        });
        // if need handle no login
        if (config.autoLoadCommentsAtLogoutEnabled) {
          initHandleNoLoginOuter(config);
        }

        break;

      case 'author':
        debug('detect author page.');

        initAuthor(pageParams, userStorage, true);

        break;
      default:
        debug('do not need handle.');
        break;
    }
    browser.runtime.sendMessage(
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
      browser.runtime.sendMessage(
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
