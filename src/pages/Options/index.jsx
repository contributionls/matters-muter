/* eslint-disable no-undef */
import '../../utils/entry';
import React from 'react';
import { render } from 'react-dom';

import Options from './Options';
import './index.css';

render(<Options />, window.document.querySelector('#app-container'));

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
ga('send', 'pageview', '/options.html'); // Specify the virtual path
