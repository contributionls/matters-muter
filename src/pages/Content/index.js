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
    init();

    // Standard Google Universal Analytics code
    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      // eslint-disable-next-line no-unused-expressions
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      // eslint-disable-next-line no-unused-expressions
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      'script',
      'https://www.google-analytics.com/analytics.js',
      'ga'
    ); // Note: https protocol here

    ga('create', 'UA-144863614-2', 'auto'); // Enter your GA identifier
    ga('set', 'checkProtocolTask', function() {}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('require', 'displayfeatures');
    ga('send', 'pageview');
    debug('pageview');
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
  }
}

start();
