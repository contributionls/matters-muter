import React, { useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { toast } from 'react-toastify';
import { FormGroup, Typography, Switch, Button } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import UserStorage from '../../../configs/user-storage';
import Loading from '../../../components/Loading';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
    marginTop: theme.spacing(2),
  },
  space: {
    marginBottom: theme.spacing(4),
  },
}));
export default function Put() {
  const classes = useStyles();
  const theme = useTheme();
  const [loading, setLoading] = React.useState(true);
  const [config, setConfig] = React.useState('');
  const isLessLg = useMediaQuery(theme.breakpoints.down('xs'));
  const userStorage = new UserStorage();
  useEffect(() => {
    userStorage.get().then((config) => {
      setConfig(JSON.stringify(config, null, 2));
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (value) => {
    setConfig(value);
  };
  const handleSave = async () => {
    const id = toast('正在導入配置...', {
      autoClose: false,
    });
    try {
      const newConfig = JSON.parse(config);
      await userStorage.set(newConfig);
      toast.dismiss(id);
      toast.success('成功導入配置');
    } catch (error) {
      toast.dismiss(id);
      toast.error('導入配置失敗,無法解析該配置');
    }
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
        說明：導入配置請直接在下面的編輯框粘貼配置內容並點擊保存配置按鈕即可，所以如果有人共享他的的靜音配置，你就可以一鍵導入了。導出同理，直接複製下面編輯框的內容即可。理論上在界面裡可以設置的選項都可以直接修改下面的配置文件來修改。
      </Typography>
      <AceEditor
        mode="json"
        theme="github"
        onChange={handleChange}
        name="UNIQUE_ID_OF_DIV"
        value={config}
        wrapEnabled={true}
        tabSize={2}
        height={300}
        width={isLessLg ? 300 : 600}
        showGutter={false}
        enableBasicAutocompletion
        editorProps={{ $blockScrolling: true }}
      />
      <FormGroup row className={classes.buttonBox}>
        <Button
          onClick={handleSave}
          size="large"
          variant="outlined"
          color="secondary"
        >
          保存配置
        </Button>
      </FormGroup>
    </div>
  );
}
