import allProfiles from './allProfiles';
import gamepadProfiler from './gamepadProfiler';

const all = {
  allProfiles,
  gamepadProfiler,
};

function getAllDefaults({ asArray=false }={}) {
  if (asArray) return Object.values(all);
  else return all;
}

function getConfigInfo({ identifier }) {
  return all[identifier] && all[identifier].info;
}

function getDefaultContent({ identifier }) {
  return all[identifier] && all[identifier].fileContent;
}

function getDefaultAltContent({ identifier }) {
  return all[identifier] && all[identifier].alternativeContent;
}

function getEnums({ identifier }) {
  return all[identifier] && all[identifier].enums;
}

export {
  getAllDefaults,
  getConfigInfo,
  getDefaultContent,
  getDefaultAltContent,
  getEnums,
}
