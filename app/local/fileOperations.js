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
    const data = await fs.promises.readFile(customButtonNamesFilePath, 'utf-8');
    const storedButtonNames = JSON.parse(data);
    const idButtonNames = storedButtonNames[gamepad.id] || {};
    return {...defaultButtonNames, ...idButtonNames};
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('File not found, returning default button names');
      return defaultButtonNames;
    } else {
      console.error('Error reading button names file:', err);
      return defaultButtonNames;  // returning defaultButtonNames even if there is an error
    }
  }
};

const saveButtonNamesToFile = async (buttonNames, gamepadId) => {
  // Ensure the directory exists
  await checkAndCreateDir();

  try {
    // Try to read the file
    const data = JSON.parse(await fs.promises.readFile(customButtonNamesFilePath, 'utf8'));
    // Merge the new button names
    data[gamepadId] = buttonNames;
    // Write the data back to the file
    await fs.promises.writeFile(customButtonNamesFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, create it
      const data = {};
      data[gamepadId] = buttonNames;
      await fs.promises.writeFile(customButtonNamesFilePath, JSON.stringify(data, null, 2), 'utf8');
    } else {
      // If there's another kind of error, re-throw it
      throw error;
    }
  }
};

const getButtonNamesFromFile = async (gamepadId) => {
  try {
    // Try to read the file
    const data = JSON.parse(await fs.promises.readFile(customButtonNamesFilePath, 'utf-8'));
    // Return the button names for the given gamepad ID, or null if they're not in the file
    return data[gamepadId] || null;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, return null
      return null;
    } else {
      // If there's another kind of error, re-throw it
      throw error;
    }
  }
};

export {
  saveButtonNamesToFile,
  readButtonNamesFromFile,
  checkAndCreateDir,
  getButtonNamesFromFile,
}
