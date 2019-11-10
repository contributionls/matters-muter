import React, { useEffect, useState } from 'react';
import {
  FormGroup,
  TextField,
  Link,
  Typography,
  InputAdornment,
  IconButton,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';

import { toast } from 'react-toastify';
import UserStorage from '../../../configs/user-storage';
import Loading from '../../../components/Loading';
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: 180,
  },
  formGroup: {
    marginBottom: theme.spacing(4),
  },
  chipInput: {
    marginTop: theme.spacing(2),
  },
  buttonBox: {
    marginTop: theme.spacing(8),
  },
  space: {
    marginBottom: theme.spacing(4),
  },
  buttonSpace: {
    marginRight: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}));

export default function Home() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [urls, setUrls] = React.useState(['']);
  const [latestUpdate, setLatestUpdate] = React.useState(null);

  const userStorage = new UserStorage();
  useEffect(() => {
    userStorage.get().then((config) => {
      if (config.subscriptions && config.subscriptions.length > 0) {
        setUrls(config.subscriptions);
      }

      setLoading(false);
    });

    userStorage.getPrivate('latestUpdate').then((data) => {
      if (data.latestUpdate) {
        setLatestUpdate(data.latestUpdate);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getUrlsError = (allUrls) => {
    return allUrls.map((url) => {
      return !isValidUrl(url);
    });
  };
  const [urlsErrors, setUrlsError] = useState(getUrlsError(urls));
  const handleChangeUrl = (index, e) => {
    const newUrls = urls.map((url, index2) => {
      return index === index2 ? e.target.value.trim() : url;
    });
    setUrls(newUrls);
    const newUrlErrors = getUrlsError(newUrls);
    const isHasError = newUrlErrors.filter((item) => item).length > 0;
    setUrlsError(getUrlsError(newUrls));
    if (isHasError) {
      return;
    }
  };
  const handleAddUrl = () => {
    setUrls(urls.concat(''));
  };
  const handleClickDeleteUrl = (index) => {
    setUrls(
      urls.filter((_, index2) => {
        return index !== index2;
      })
    );
  };

  const handleSave = async () => {
    const id = toast('正在保存...', {
      autoClose: false,
    });
    const finalUrls = urls.filter((url) => {
      return url && isValidUrl(url);
    });
    await userStorage.set({
      subscriptions: Array.from(new Set(finalUrls)),
    });
    toast.dismiss(id);
    toast.success('保存当前设置成功');
  };
  const handleUpdateNow = async () => {
    await handleSave();
    const id = toast('正在更新配置中...', {
      autoClose: false,
    });
    // update
    // eslint-disable-next-line no-undef
    browser.runtime.sendMessage(
      {
        type: 'updateConfig',
      },
      function(response) {
        toast.dismiss(id);
        if (response.code === 'ok') {
          toast.success('已更新到最新配置');
        } else {
          toast.error('更新配置失敗，原因：' + response.message);
        }
        setTimeout(() => {
          userStorage.getPrivate('latestUpdate').then((data) => {
            if (data.latestUpdate) {
              setLatestUpdate(data.latestUpdate);
            }
          });
        }, 1000);
      }
    );
  };
  if (loading) {
    return <Loading></Loading>;
  }
  return (
    <div>
      <Typography
        className={classes.space}
        variant="body1"
        display="block"
        gutterBottom
      >
        說明：你可以訂閱網路上公開的黑名單配置，訂閱後，插件將會每天自動定時同步你訂閱的黑名單配置內容。同步策略是以本地配置為準，將你訂閱的配置合併到你目前的配置，也就是不會覆蓋你自己設置的黑名單，只會把遠端的黑名單合併到你本地來。支持訂閱多個配置源，插件會依次合併所有的配置源。當前只支持在
        <Link href="https://github.com/">Github</Link>或者
        <Link href="https://gist.github.com/">Github Gist</Link>
        上託管公開配置文件。
      </Typography>

      <FormGroup>
        {urls.map((url, index) => {
          return (
            <TextField
              key={`key_${index}`}
              id={`url${index + 1}`}
              required
              label={`遠端配置URL${index + 1}`}
              type="url"
              placeholder="請輸入公共配置的網路地址"
              onChange={handleChangeUrl.bind(null, index)}
              value={url}
              variant="outlined"
              margin="normal"
              error={urlsErrors[index]}
              helperText={urlsErrors[index] ? 'URL is invalid!' : ''}
              InputProps={{
                endAdornment:
                  index > 0 ? (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label="Remove this item"
                        onClick={handleClickDeleteUrl.bind(null, index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
              }}
            />
          );
        })}
      </FormGroup>

      <FormGroup row className={classes.buttonBox}>
        <Button
          onClick={handleAddUrl}
          size="large"
          variant="outlined"
          color="secondary"
          className={classes.buttonSpace}
        >
          <AddIcon fontSize="small" className={classes.buttonIcon} />
          新增一個訂閱源
        </Button>
        <Button
          onClick={handleUpdateNow}
          size="large"
          variant="outlined"
          color="secondary"
          className={classes.buttonSpace}
        >
          立即更新
        </Button>
        <Button
          onClick={handleSave}
          size="large"
          variant="outlined"
          color="primary"
          className={classes.buttonSpace}
        >
          保存設置
        </Button>
      </FormGroup>
      <Typography
        className={classes.space}
        variant="caption"
        display="block"
        color="textSecondary"
        gutterBottom
      >
        {latestUpdate &&
          `上次更新時間：${new Date(latestUpdate.time)} ，狀態：${
            latestUpdate.status
          } ${
            latestUpdate.status === 'fail'
              ? '，原因：' + latestUpdate.message
              : ''
          }`}
      </Typography>

      <div className={classes.space}></div>
      <Typography
        className={classes.space}
        variant="body1"
        display="block"
        gutterBottom
      >
        遠程黑名單配置格式說明：
        <Link href="http://www.json.org/">JSON格式</Link>
        ，例子如下：
      </Typography>
      <pre>
        {`{
  "mutedUsers": ["username1","username2"]
}`}
      </pre>
      <Typography variant="body1" display="block" gutterBottom>
        理論上你也可以在配置裡加入一些別的配置項（見導入/導出的配置格式），但目前應該沒必要在公共配置裡加別的字段。下面是一個示例的有效公共配置地址(
        <Link href="https://github.com/contributionls/matters-muted-config">
          項目地址
        </Link>
        ):
      </Typography>
      <pre>
        https://raw.githubusercontent.com/contributionls/matters-muted-config/master/config.json
      </pre>
      <Typography
        className={classes.space}
        variant="body1"
        display="block"
        gutterBottom
      >
        當前只支持在
        <Link href="https://github.com/">Github</Link>或者
        <Link href="https://gist.github.com/">Github Gist</Link>
        上託管公開配置文件，你可以在Github上共享，與別人協作公共配置文件。你可以在
        <Link
          rel="noopener noreferrer"
          target="_blank"
          href="https://rebrand.ly/muter"
        >
          這篇Matters文章
        </Link>
        下的評論區查看有沒有用戶共享公共配置。
      </Typography>
      <Typography
        className={classes.space}
        variant="body1"
        display="block"
        gutterBottom
      >
        取消訂閱遠程配置：直接清空輸入框，並保存設置即可。
      </Typography>
    </div>
  );
}

function isValidUrl(string) {
  if (!string) {
    return true;
  }
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
