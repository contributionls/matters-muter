import React, { useEffect } from 'react';
import { FormGroup, FormControlLabel, Switch, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
}));

export default function Home() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [syncSettings, setSyncSettings] = React.useState(true);
  const userStorage = new UserStorage();
  useEffect(() => {
    userStorage.get().then((config) => {
      setSyncSettings(config.syncSettings);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSyncSettings = (e, value) => {
    setSyncSettings(value);
  };

  const handleSave = async () => {
    const id = toast('正在保存...', {
      autoClose: false,
    });
    await userStorage.set({
      syncSettings: syncSettings,
    });
    toast.dismiss(id);
    toast.success('保存当前设置成功');
  };
  if (loading) {
    return <Loading></Loading>;
  }
  return (
    <div>
      <FormGroup className={classes.formGroup}>
        <FormControlLabel
          control={
            <Switch
              checked={syncSettings}
              onChange={handleSyncSettings}
              value={syncSettings}
            />
          }
          label="自動在Chrome瀏覽器雲端同步該設置"
        />
      </FormGroup>

      <FormGroup row className={classes.buttonBox}>
        <Button
          onClick={handleSave}
          size="large"
          variant="outlined"
          color="secondary"
        >
          保存設置
        </Button>
      </FormGroup>
    </div>
  );
}