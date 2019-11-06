import { getConfig } from '../../configs/util';
import { getCurrentPage } from '../../utils/page';
import { initFilterComment } from '../../utils/comment';
import debug from '../../utils/debug';

debug('init start');
// 1. read config
const config = getConfig();
const { mutedUsers } = config;
// 2. get current page
const currentPage = getCurrentPage();
// 3. handle
switch (currentPage) {
  case 'detail':
    // if detail, handle comments list
    initFilterComment({
      mutedUsers: mutedUsers,
    });

    break;
  default:
    break;
}
