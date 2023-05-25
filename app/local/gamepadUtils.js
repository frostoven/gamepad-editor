import {defaultGamepadButtons} from './default_buttons.js';

// This function generates default button names based on the provided gamepad.
const generateDefaultButtonNames = (gamepad) => {
  const defaultButtonNames = {};

  // Check if gamepad and buttons exist before trying to generate names.
  if (gamepad && gamepad.buttons) {
    for (let i = 0; i < gamepad.buttons.length; i++) {
      defaultButtonNames[`bt${i}`] = `Button ${i}`;  // Default naming convention for buttons.
    }
  }

  // Check if gamepad and axes exist before trying to generate names.
  if (gamepad && gamepad.axes) {
    for (let i = 0; i < gamepad.axes.length; i++) {
      defaultButtonNames[`ax${i}`] = `Axis ${i}`;  // Default naming convention for axes.
    }
  }

  // If gamepad is not null and has an id, try to match the gamepad id with pre-defined ids.
  if (gamepad && gamepad.id) {
    const keywords = gamepad.id.split(" ");
    for (let gp of defaultGamepadButtons) {
      // If any keyword in the gamepad id matches any keyword for a pre-defined gamepad,
      // merge the pre-defined button names with the default ones, giving preference to the pre-defined names.
      if (keywords.some(keyword => gp.keywords.includes(keyword))) {
        return {...defaultButtonNames, ...gp.buttons};
      }
    }
  }

  // If no matching id is found, return the default button names.
  return defaultButtonNames;
};

export {
  generateDefaultButtonNames
}
