export function isBelongUsernames(username,usernames){
  if(Array.isArray(usernames)){
    return usernames.some(user=>{
      return isMatchedUsername(username,user)
    })
  }else{
    return false
  }
}
export function isMatchedUsername(u1, u2) {
  // ignore @
  if (u1 && u2) {
    u1 = u1.trim();
    u2 = u2.trim();
    if (u1[0] === "@") {
      u1 = u1.substr(1);
    }
    if (u2[0] === "@") {
      u2 = u2.substr(1);
    }
    return u1 === u2;
  } else {
    return false;
  }
}
