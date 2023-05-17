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

export {
  generateDefaultButtonNames
}
