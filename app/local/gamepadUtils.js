import { friendlyButtonNames, guessGamepadName } from '../GamepadManager/types/gamepadNames';

// This function generates default button names based on the provided gamepad.
const generateDefaultButtonNames = (gamepad) => {
  let defaultButtonNames = {};

  if (gamepad) {
    // Transform the raw gamepad ID to a friendly name
    const gamepadName = guessGamepadName(gamepad.id);

    // Fetch the specific controller button names if it exists, otherwise fetch the default
    const controllerFriendlyNames = friendlyButtonNames[gamepadName] || friendlyButtonNames['default'];

    // Now add any remaining default names for buttons and axes that weren't covered by the friendly names
    if (gamepad.buttons) {
      for (let i = 0; i < gamepad.buttons.length; i++) {
        defaultButtonNames[`bt${i}`] = controllerFriendlyNames[`bt${i}`] || `Button ${i}`;
      }
    }

    if (gamepad.axes) {
      for (let i = 0; i < gamepad.axes.length; i++) {
        defaultButtonNames[`ax${i}`] = controllerFriendlyNames[`ax${i}`] || `Axis ${i}`;
      }
    }
  }

  return defaultButtonNames;
};

export {
  generateDefaultButtonNames
}
