import {useEffect, useState} from 'react';
import path from 'path';
import fs from 'fs';
import userProfile from '../../userProfile';
import {readButtonNamesFromFile, saveButtonNamesToFile} from '../../local/FileOperations'

const profileDir = path.join(userProfile.getUserDataDir(), 'Frostoven/GamepadProfiler');

const checkAndCreateDir = async () => {
  try {
    await fs.promises.access(profileDir);
  } catch (e) {
    await fs.promises.mkdir(profileDir, {recursive: true});
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

const ButtonNamesManager = ({gamepad}) => {
  const [buttonNames, setButtonNames] = useState(() => generateDefaultButtonNames(gamepad));

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
    const newButtonNames = {...buttonNames};
    newButtonNames[key] = newName;
    await saveButtonNamesToFile(newButtonNames);
    setButtonNames(newButtonNames);
  };

  return {
    buttonNames,
    handleRenameButtonClick,
  };
};

export {
  ButtonNamesManager,
  checkAndCreateDir,
  generateDefaultButtonNames
}
