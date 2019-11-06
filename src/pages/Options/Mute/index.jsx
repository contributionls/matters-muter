import React from 'react';
import Chip from '@material-ui/core/Chip';
import ChipInput from 'material-ui-chip-input';
import { plusAt } from '../../../utils/common';
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
  const [chips, setChips] = React.useState([]);
  const handleAddChip = (value) => {
    // split by space
    const chipsSet = new Set(chips);

    value
      .split(' ')
      .filter((item) => item.trim())
      .forEach((item) => {
        chipsSet.add(item);
      });
    console.log('xxx', Array.from(chipsSet));
    setChips(Array.from(chipsSet));
  };
  const handleDeleteChip = (value) => {
    const chipsSet = new Set(chips);
    chipsSet.delete(value);
    setChips(Array.from(chipsSet));
  };
  return (
    <div>
      <ChipInput
        fullWidth
        variant="outlined"
        label="靜音用戶名單"
        helperText="空格分割可以輸入多個用戶,用戶名前面加不加@都可以，你也可以在用戶個人主頁找到按鈕添加到靜音名單里"
        value={chips}
        onAdd={(chip) => handleAddChip(chip)}
        onDelete={(chip, index) => handleDeleteChip(chip, index)}
        chipRenderer={chipRenderer}
      />
    </div>
  );
}
