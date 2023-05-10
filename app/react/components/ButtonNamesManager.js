import { useEffect, useState } from 'react';
import path from 'path';
import { getUserDataDir } from '../../userProfile';

const userDataDir = getUserDataDir();
const buttonNamesFilePath = path.join(userDataDir, 'button_names.json');
const fs = require('fs');

const readButtonNamesFromFile = () => {
  try {
    const data = fs.readFileSync(buttonNamesFilePath, 'utf-8');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading button names file:', error);
    return {};
  }
};

const saveButtonNamesToFile = (buttonNames) => {
  try {
    const data = JSON.stringify(buttonNames, null, 2);
    fs.writeFileSync(buttonNamesFilePath, data, 'utf-8');
  } catch (err) {
    console.error('Error writing button names file:', err);
  }
};

export const ButtonNamesManager = ({ gamepad }) => {
  const [buttonNames, setButtonNames] = useState(gamepad ? Array(gamepad.buttons.length).fill("") : []);

  useEffect(() => {
    if (gamepad) {
      const storedButtonNames = readButtonNamesFromFile(gamepad);
      setButtonNames(storedButtonNames);
    }
  }, [gamepad]);

  const handleRenameButtonClick = (index, newName, isAxis) => {
    setButtonNames((prevButtonNames) => {
      const key = isAxis ? `ax${index}` : `bt${index}`;
      const newButtonNames = { ...prevButtonNames };
      newButtonNames[key] = newName;
      saveButtonNamesToFile(newButtonNames);
      return newButtonNames;
    });
  };

  return {
    buttonNames,
    handleRenameButtonClick,
  };
};

export default ButtonNamesManager;
