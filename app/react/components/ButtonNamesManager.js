import {useEffect, useState} from 'react';
import path from 'path';
import { getUserDataDir } from '../../userProfile';

const userDataDir = getUserDataDir();
const buttonNamesFilePath = path.join(userDataDir, 'button_names.json');
const fs = require('fs');
const buttonNamesFilename = 'buttonNames.json';
const buttonNamesFilepath = path.join(getUserDataDir(), buttonNamesFilename);

const readButtonNamesFromFile = () => {
  try {
    const data = fs.readFileSync(buttonNamesFilePath, 'utf-8');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading button names file:', error);
    return {};
  }
};

function saveButtonNamesToFile(buttonNames) {
  try {
    const data = JSON.stringify(buttonNames);
    fs.writeFileSync(buttonNamesFilepath, data, 'utf8');
  } catch (err) {
    console.error('Error writing button names file:', err);
  }
}

export const ButtonNamesManager = ({ gamepad }) => {
  const [buttonNames, setButtonNames] = useState(gamepad ? Array(gamepad.buttons.length).fill("") : []);

  useEffect(() => {
    if (gamepad) {
      const storedButtonNames = readButtonNamesFromFile();
      setButtonNames(storedButtonNames);
    }
  }, [gamepad]);

  const handleRenameButtonClick = (index, newName) => {
    setButtonNames((prevButtonNames) => {
      if (!Array.isArray(prevButtonNames)) {
        prevButtonNames = [];
      }
      const newButtonNames = [...prevButtonNames];
      newButtonNames[index] = newName;
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