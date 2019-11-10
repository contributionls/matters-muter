import React from 'react';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { Typography, Container, Link } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  space: {
    marginBottom: theme.spacing(4),
  },
  heroContent: {
    padding: theme.spacing(2, 0, 6),
  },
  intro: {
    color: 'rgba(0,0,0,0.8)',
    padding: theme.spacing(1),
  },
}));
export default function Put() {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div>
      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography
          component="h3"
          variant="h4"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Matters消音器
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="textSecondary"
          component="p"
        >
          當前版本：V0.0.3
        </Typography>
      </Container>
      <div>
        <Typography className={classes.intro} variant="body1" gutterBottom>
          Matters消音器是一款非官方的chrome擴展，源代碼開源，期待能藉此擴展提升Matters的閱讀體驗。
        </Typography>

        <Typography className={classes.intro} variant="body1" gutterBottom>
          本擴展的本意並非為了阻止讀者在Matters上的交流，相反，我一直認為理不辨不明，我們應該勇於突破同溫層，而Matters就是一個絕佳的途徑。但是隨著Matters的發展，社區裡確實出现了一些不能稱之為有效討論的留言，看了之後非常影響心情，而Matters官方目前還不支持針對用戶的全站屏蔽功能，所以才開發了Matters消音器这个扩展。
        </Typography>
        <Typography className={classes.intro} variant="body1" gutterBottom>
          当前支持根據用戶名单，關鍵詞，踩的人數來自動折疊評論，支持訂閱公開黑名單。
        </Typography>
        <Typography className={classes.intro} variant="body1" gutterBottom>
          使用說明可以參見
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://rebrand.ly/muter"
          >
            這篇Matters文章
          </Link>
          。
        </Typography>

        <Typography className={classes.intro} variant="body1" gutterBottom>
          歡迎大家的任何建議以及Bug反饋，可以在本項目的
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/contributionls/matters-muter"
          >
            Github
          </Link>
          頁面提交
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/contributionls/matters-muter/issues"
          >
            Issue
          </Link>
          或
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/contributionls/matters-muter/pulls"
          >
            Pull Request
          </Link>
          或在
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://rebrand.ly/muter"
          >
            這篇Matters文章
          </Link>
          下留言。
        </Typography>
        <Typography className={classes.intro} variant="body1" gutterBottom>
          如果你喜歡本擴展，歡迎在
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://rebrand.ly/muter"
          >
            這篇Matters文章
          </Link>
          下讚賞，謝謝
          <span aria-label="thanks" role="img">
            🙏
          </span>
        </Typography>
      </div>
    </div>
  );
}
