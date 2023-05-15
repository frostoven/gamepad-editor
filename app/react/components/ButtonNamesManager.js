import { useEffect, useState } from 'react';
import path from 'path';
import userProfile from '../../userProfile';
import fs from 'fs';

const profileDir = path.join(userProfile.getUserDataDir(), 'Frostoven/GamepadProfiler');
const buttonNamesFilePath = path.join(profileDir, 'button_names.json');

const checkAndCreateDir = async (dir) => {
  try {
    await fs.promises.access(dir);
  } catch (e) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
};

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
  const [buttonNames, setButtonNames] = useState(() => generateDefaultButtonNames(gamepad));

  const initializeButtonNames = async () => {
    await checkAndCreateDir(profileDir);
    if (gamepad) {
      const storedButtonNames = await readButtonNamesFromFile(gamepad);
      setButtonNames(storedButtonNames);
    }
  };

  useEffect(() => {
    initializeButtonNames();
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
