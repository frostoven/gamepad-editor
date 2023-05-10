import { useEffect, useState } from 'react';
import path from 'path';
import { getUserDataDir } from '../../userProfile';

const userDataDir = getUserDataDir();
const buttonNamesFilePath = path.join(userDataDir, 'button_names.json');
const fs = require('fs');

const generateDefaultButtonNames = (gamepad) => {
  const defaultButtonNames = {};
  for (let i = 0; i < gamepad.buttons.length; i++) {
    defaultButtonNames[`bt${i}`] = `Button ${i}`;
  }
  for (let i = 0; i < gamepad.axes.length; i++) {
    defaultButtonNames[`ax${i}`] = `Axis ${i}`;
  }
  return defaultButtonNames;
};

const readButtonNamesFromFile = (gamepad) => {
  if (fs.existsSync(buttonNamesFilePath)) {
    try {
      const data = fs.readFileSync(buttonNamesFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading button names file:', err);
      return generateDefaultButtonNames(gamepad);
    }
  } else {
    return generateDefaultButtonNames(gamepad);
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
