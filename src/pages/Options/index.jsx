/* eslint-disable no-undef */
import '../../utils/entry';
import React from 'react';
import { render } from 'react-dom';
import { initAnalytics, isFirefox } from '../../utils/common';

import Options from './Options';
import './index.css';

render(<Options />, window.document.querySelector('#app-container'));
initAnalytics();
if (!isFirefox()) {
  ga('send', 'pageview', '/options.html'); // Specify the virtual path
}
