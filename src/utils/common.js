export function isBelongUsernames(username, usernames) {
  if (Array.isArray(usernames)) {
    return usernames.some((user) => {
      return isMatchedUsername(username, user);
    });
  } else {
    return false;
  }
}

export function isBelongKeywords(content, keywords) {
  if (Array.isArray(keywords)) {
    return keywords.find((keyword) => {
      return content.includes(keyword.trim());
    });
  } else {
    return false;
  }
}
export function isMatchedUsername(u1, u2) {
  // ignore @
  if (u1 && u2) {
    u1 = u1.trim();
    u2 = u2.trim();
    if (u1[0] === '@') {
      u1 = u1.substr(1);
    }
    if (u2[0] === '@') {
      u2 = u2.substr(1);
    }
    return u1 === u2;
  } else {
    return false;
  }
}
export function plusAt(username) {
  if (username) {
    username = username.trim();
    if (username[0] === '@') {
      return username;
    } else {
      return `@${username}`;
    }
  } else {
    return username;
  }
}

export function initAnalytics() {
  if (!isFirefox()) {
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
  }
}

export function isFirefox() {
  return typeof InstallTrigger !== 'undefined';
}
