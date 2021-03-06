import React, { useEffect } from 'react';
import Chip from '@material-ui/core/Chip';
import {
  TextField,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Switch,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChipInput from 'material-ui-chip-input';
import { plusAt } from '../../../utils/common';
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
    marginBottom: theme.spacing(5),
  },
  chipInput: {
    marginTop: theme.spacing(2),
  },
  buttonBox: {
    marginTop: theme.spacing(8),
  },
}));
const chipRenderer = (
  { value, text, isDisabled, isReadOnly, handleClick, handleDelete, className },
  key
) => {
  const handleClickChip = (...props) => {
    handleClick(...props);
    // auto plus @
    window.open(`https://matters.news/${plusAt(value)}`, '_blank');
  };
  return (
    <Chip
      key={key}
      className={className}
      style={{
        pointerEvents: isDisabled || isReadOnly ? 'none' : undefined,
      }}
      onClick={handleClickChip}
      onDelete={handleDelete}
      label={text}
    />
  );
};

export default function Home() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [isMutedByUsername, setIsMutedByUsername] = React.useState(true);
  const [chips, setChips] = React.useState([]);
  const [mutedByKeywordEnabled, setMutedByKeywordEnabled] = React.useState(
    true
  );
  const [mutedKeywords, setMutedKeywords] = React.useState([]);
  const [isMutedByDownVote, setIsMutedByDownVote] = React.useState(false);
  const [downVote, setDownVote] = React.useState(0);

  const [
    profileMutedShortcutEnabled,
    setProfileMutedShortcutEnabled,
  ] = React.useState(true);

  const userStorage = new UserStorage();
  useEffect(() => {
    userStorage.get().then((config) => {
      setIsMutedByUsername(config.mutedByUsernameEnabled);
      setChips(config.mutedUsers);
      setMutedByKeywordEnabled(config.mutedByKeywordEnabled);
      setMutedKeywords(config.mutedKeywords);
      setIsMutedByDownVote(config.mutedByDownVoteEnabled);
      setDownVote(config.downVote);
      setProfileMutedShortcutEnabled(config.profileMutedShortcutEnabled);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleIsMutedByUsername = (e, value) => {
    setIsMutedByUsername(value);
  };
  const handleAddChip = (value) => {
    // split by space
    const chipsSet = new Set(chips);

    value
      .split(' ')
      .filter((item) => item.trim())
      .forEach((item) => {
        chipsSet.add(item);
      });
    setChips(Array.from(chipsSet));
  };
  const handleDeleteChip = (value) => {
    const chipsSet = new Set(chips);
    chipsSet.delete(value);
    setChips(Array.from(chipsSet));
  };
  const handleMutedByKeywordEnabled = (e, value) => {
    setMutedByKeywordEnabled(value);
  };
  const handleAddKeyword = (value) => {
    // split by space
    const chipsSet = new Set(mutedKeywords);

    value
      .split(' ')
      .filter((item) => item.trim())
      .forEach((item) => {
        chipsSet.add(item);
      });
    setMutedKeywords(Array.from(chipsSet));
  };
  const handleDeleteKeyword = (value) => {
    const chipsSet = new Set(mutedKeywords);
    chipsSet.delete(value);
    setMutedKeywords(Array.from(chipsSet));
  };
  const handleIsMutedByDownVote = (e, value) => {
    setIsMutedByDownVote(value);
  };
  const handleProfileMutedShortcutEnabled = (e, value) => {
    setProfileMutedShortcutEnabled(value);
  };

  const handleDownVoteChange = (e) => {
    if (e.target.value === '') {
      setDownVote('');
      return;
    }
    const value = Number(e.target.value);
    if (Number.isInteger(value)) {
      setDownVote(Number(value));
    }
  };
  const handleSave = async () => {
    const id = toast('正在保存...', {
      autoClose: false,
    });
    await userStorage.set({
      mutedByUsernameEnabled: isMutedByUsername,
      mutedUsers: chips,
      mutedByDownVoteEnabled: isMutedByDownVote,
      downVote: downVote,
      mutedByKeywordEnabled: mutedByKeywordEnabled,
      mutedKeywords: mutedKeywords,
      profileMutedShortcutEnabled,
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
              checked={isMutedByDownVote}
              onChange={handleIsMutedByDownVote}
              value={isMutedByDownVote}
            />
          }
          label="開啟根據踩(👎)的数量來隱藏評論？"
        />

        {isMutedByDownVote ? (
          <TextField
            id="outlined-basic"
            className={classes.textField}
            label="當踩的数量多於"
            type="number"
            value={downVote}
            margin="normal"
            onChange={handleDownVoteChange}
            variant="outlined"
          />
        ) : null}
      </FormGroup>
      <FormGroup className={classes.formGroup}>
        <FormControlLabel
          control={
            <Switch
              checked={isMutedByUsername}
              onChange={handleIsMutedByUsername}
              value={isMutedByUsername}
            />
          }
          label="開啟根據用戶名來隱藏評論？"
        />
        {isMutedByUsername ? (
          <ChipInput
            className={classes.chipInput}
            fullWidth
            variant="outlined"
            label="靜音用戶ID名單"
            helperText="按回車鍵輸入，可以用空格分隔多個用戶ID,注意，這裏是用戶ID，而非用戶暱稱，ID前面加不加@都可以，你也可以在用戶個人主頁找到靜音按鈕快捷添加到靜音用戶名單"
            value={chips}
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip, index) => handleDeleteChip(chip, index)}
            chipRenderer={chipRenderer}
          />
        ) : null}
      </FormGroup>
      <FormGroup className={classes.formGroup}>
        <FormControlLabel
          control={
            <Switch
              checked={mutedByKeywordEnabled}
              onChange={handleMutedByKeywordEnabled}
              value={mutedByKeywordEnabled}
            />
          }
          label="開啟根據關鍵詞來隱藏評論？"
        />
        {mutedByKeywordEnabled ? (
          <ChipInput
            className={classes.chipInput}
            fullWidth
            variant="outlined"
            label="關鍵詞名單"
            helperText="按回車鍵輸入，可以用空格分隔多個關鍵詞"
            value={mutedKeywords}
            onAdd={(chip) => handleAddKeyword(chip)}
            onDelete={(chip, index) => handleDeleteKeyword(chip, index)}
            chipRenderer={chipRenderer}
          />
        ) : null}
      </FormGroup>

      <FormGroup className={classes.formGroup}>
        <FormControlLabel
          control={
            <Switch
              checked={profileMutedShortcutEnabled}
              onChange={handleProfileMutedShortcutEnabled}
              value={profileMutedShortcutEnabled}
            />
          }
          label="在Matters的作者主页添加快捷静音按钮"
        />
        <FormHelperText variant="outlined">
          开启后，你可以在作者主頁點擊【更多操作】的圖標，再點擊【全站靜音】,就可以快速將該作者全站拉黑了
        </FormHelperText>
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
