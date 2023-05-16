import path from 'path';
import fs from 'fs';
import userProfile from './userProfile';

const profileDir = path.join(userProfile.getUserDataDir(), 'Frostoven/GamepadProfiler');

export const checkAndCreateDir = async () => {
  try {
    await fs.promises.access(profileDir);
  } catch (e) {
    await fs.promises.mkdir(profileDir, { recursive: true });
  }
};
