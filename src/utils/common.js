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
