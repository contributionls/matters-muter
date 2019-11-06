import userConfig from "./user-config";
import config from "./config";
export function getConfig() {
  return {
    mutedUsers: userConfig.muted_users
    // mutedUsers:[]
  };
}
