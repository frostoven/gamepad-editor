import { useEffect, useState } from 'react';
import path from 'path';
import userProfile from '../../userProfile';
import fs from 'fs';

const userDataDir = userProfile.getUserDataDir();
const buttonNamesFilePath = path.join(userDataDir, 'button_names.json');

const generateDefaultButtonNames = (gamepad) => {
  const defaultButtonNames = {};

  if (gamepad && gamepad.buttons) {
    for (let i = 0; i < gamepad.buttons.length; i++) {
      defaultButtonNames[`bt${i}`] = `Button ${i}`;
    }
  }

  if (gamepad && gamepad.axes) {
    for (let i = 0; i < gamepad.axes.length; i++) {
      defaultButtonNames[`ax${i}`] = `Axis ${i}`;
    }
  }

  return defaultButtonNames;
};

const readButtonNamesFromFile = async (gamepad) => {
  const defaultButtonNames = generateDefaultButtonNames(gamepad);
  try {
    const data = await fs.promises.readFile(buttonNamesFilePath, 'utf-8');
    const storedButtonNames = JSON.parse(data);
    return { ...defaultButtonNames, ...storedButtonNames };
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('File not found, returning default button names');
      return defaultButtonNames;
    } else {
      console.error('Error reading button names file:', err);
    }
  }
};

const saveButtonNamesToFile = async (buttonNames) => {
  try {
    const data = JSON.stringify(buttonNames, null, 2);
    await fs.promises.writeFile(buttonNamesFilePath, data, 'utf-8');
  } catch (err) {
    console.error('Error writing button names file:', err);
  }
};

export const ButtonNamesManager = ({ gamepad }) => {
  const [buttonNames, setButtonNames] = useState(() => readButtonNamesFromFile(gamepad));

  useEffect(() => {
    if (gamepad) {
      // Whenever the gamepad prop changes, read button names from file and update state
      readButtonNamesFromFile(gamepad).then(storedButtonNames => {
        setButtonNames(storedButtonNames);
      });
    }
  }, [gamepad]);

  const handleRenameButtonClick = async (index, newName, isAxis) => {
    const key = isAxis ? `ax${index}` : `bt${index}`;
    const newButtonNames = { ...buttonNames };
    newButtonNames[key] = newName;
    await saveButtonNamesToFile(newButtonNames);
    setButtonNames(newButtonNames);
  };

  return {
    buttonNames,
    handleRenameButtonClick,
  };
};

export default ButtonNamesManager;
