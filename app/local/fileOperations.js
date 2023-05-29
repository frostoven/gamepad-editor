import fs from 'fs';
import path from 'path';
import userProfile from '../userProfile'
import {generateDefaultButtonNames} from './gamepadUtils'

const profileDir = path.join(userProfile.getUserDataDir(), 'CosmosisGame/controllerNameMods/');
const customButtonNamesFilePath = path.join(profileDir, 'custom_button_names.json');

const checkAndCreateDir = async () => {
  try {
    await fs.promises.access(profileDir);
  } catch (e) {
    await fs.promises.mkdir(profileDir, {recursive: true});
  }
};

const readButtonNamesFromFile = async (gamepad) => {
    const defaultButtonNames = generateDefaultButtonNames(gamepad);
    try {
      const data = await fs.promises.readFile(buttonNamesFilePath, 'utf-8');
      const storedButtonNames = JSON.parse(data);
      return {...defaultButtonNames, ...storedButtonNames};
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

export {
  saveButtonNamesToFile,
  readButtonNamesFromFile,
  checkAndCreateDir,
}
