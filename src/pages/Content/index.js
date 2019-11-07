import UserStorage from '../../configs/user-storage';
import { getCurrentPage } from '../../utils/page';
import { initFilterComment } from '../../utils/comment';
import debug from '../../utils/debug';
const userStorage = new UserStorage();
debug('init start');
// 1. read config
async function start() {
  const config = await userStorage.get();
  // 2. get current page
  const currentPage = getCurrentPage();
  // 3. handle
  switch (currentPage) {
    case 'detail':
      // if detail, handle comments list
      initFilterComment(config);

      break;
    default:
      break;
  }
}

start();
