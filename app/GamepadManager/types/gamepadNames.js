// Dev note: not all these were tested, as I don't own all these devices.
// Confirmed accurate:
// * Xbox 360 Controller (XInput STANDARD GAMEPAD)
// * Sony devices 0268 and 09cc.
const knownGamepadNames = {
  'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)': 'Sony Dualshock 3 Controller',
  'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)': 'Sony Dualshock 4 Controller',
  'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)': 'Sony Dualshock 4 Controller (2nd Gen)',
  'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)': 'Sony DualSense Controller',
  'Xbox 360 Controller (XInput STANDARD GAMEPAD)': 'Xbox 360 Controller',
  'Throttle - HOTAS Warthog (Vendor: 044f Product: 0404)': 'HOTAS Warthog Throttle',
  'Joystick - HOTAS Warthog (Vendor: 044f Product: 0402)': 'HOTAS Warthog Flight Stick',
};

function guessGamepadName(string) {
  if (knownGamepadNames[string]) {
    return knownGamepadNames[string];
  }
  else if (string.includes('Vendor: 054c')) {
    return `[Sony] ${string}`;
  }
  else if (string.includes('Vendor: 045e')) {
    return `[Xbox] ${string}`;
  }
  else {
    return string;
  }
}

// ----------------------------------------------------------------------------

const friendlyButtonNames = {};

// TODO: When showing in the controls menu, add mechanism to surround Xbox
//  buttons in a rounded green box, Sony in blue (or dark grey?), and all other
//  brands in orange.

friendlyButtonNames['Generic'] = {
  ax0: 'Axis 0',
  ax1: 'Axis 1',
  ax2: 'Axis 2',
  ax3: 'Axis 3',
  ax4: 'Axis 4',
  //
  bt0: 'Button 0',
  bt1: 'Button 1',
  bt2: 'Button 2',
  bt3: 'Button 3',
  bt4: 'Button 4',
  bt5: 'Button 5',
  bt6: 'Button 6',
  bt7: 'Button 7',
  bt8: 'Button 8',
  bt9: 'Button 9',
  bt10: 'Button 10',
  bt11: 'Button 11',
  bt12: 'Button 12',
  bt13: 'Button 13',
  bt14: 'Button 14',
  bt15: 'Button 15',
  bt16: 'Button 16',
  bt17: 'Button 17',
  bt18: 'Button 18',
  bt19: 'Button 19',
  bt20: 'Button 20',
  bt21: 'Button 21',
  bt22: 'Button 22',
  bt23: 'Button 23',
  bt24: 'Button 24',
  bt25: 'Button 25',
  bt26: 'Button 26',
  bt27: 'Button 27',
  bt28: 'Button 28',
  bt29: 'Button 29',
  bt30: 'Button 30',
  bt31: 'Button 31'
}
friendlyButtonNames['default'] = friendlyButtonNames['Generic'];

friendlyButtonNames['Xbox 360 Controller'] = {
  ax0: 'LS Vertical',
  ax1: 'LS Horizontal',
  ax3: 'RS Vertical',
  ax4: 'RS Horizontal',
  //
  bt0: 'A',
  bt1: 'B',
  bt2: 'X',
  bt3: 'Y',
  bt4: 'Left Bumper',
  bt5: 'Right Bumper',
  bt6: 'Left Trigger',
  bt7: 'Right Trigger',
  bt8: 'Back',
  bt9: 'Start',
  bt10: 'Left Stick Button',
  bt11: 'Right Stick Button',
  bt12: 'D-Pad Up',
  bt13: 'D-Pad Down',
  bt14: 'D-Pad Left',
  bt15: 'D-Pad Right',
  bt16: 'Xbox Button',
  bt17: 'Xbox Bt 17',
  bt18: 'Xbox Bt 18',
};

friendlyButtonNames['Sony Dualshock 3 Controller'] = {
  ax0: 'LS Vertical',
  ax1: 'LS Horizontal',
  ax3: 'RS Vertical',
  ax4: 'RS Horizontal',
  //
  bt0: '✖',
  bt1: '●',
  bt2: '■',
  bt3: '▲',
  bt4: 'L1',
  bt5: 'R1',
  bt6: 'L2',
  bt7: 'R2',
  bt8: 'Select',
  bt9: 'Start',
  bt10: 'L3',
  bt11: 'R3',
  bt12: 'D-Up',
  bt13: 'D-Down',
  bt14: 'D-Left',
  bt15: 'D-Right',
  bt16: 'PlayStation Button',
  bt17: 'DS3 Bt 17',
  bt18: 'DS3 Bt 18',
};

friendlyButtonNames['Sony Dualshock 4 Controller'] = { ...friendlyButtonNames['Sony Dualshock 3 Controller'] };
const ds4 = friendlyButtonNames['Sony Dualshock 4 Controller'];
friendlyButtonNames['Sony Dualshock 4 Controller (2nd Gen)'] = ds4;
ds4.bt8 = 'Share';
ds4.bt9 = 'Options';
ds4.bt17 = 'Touchpad Click';
ds4.bt18 = 'DS4 Bt 18';

friendlyButtonNames['Sony DualSense Controller'] = { ...friendlyButtonNames['Sony Dualshock 3 Controller'] };
const ds5 = friendlyButtonNames['Sony DualSense Controller'];
ds5.bt8 = 'Create';
ds5.bt9 = 'Options';
ds5.bt17 = 'Touchpad Click';
ds5.bt18 = 'DS5 Bt 18';

// Dev note: the manual counts from 1 instead of 0.
friendlyButtonNames['HOTAS Warthog Throttle'] = {
  ax0: 'Slew Control Axis [0]',
  ax1: 'Slew Control Axis [1]',
  ax2: 'Throttle [Right Half]',
  ax5: 'Throttle [Left Half]',
  ax6: 'Throttle [Friction control]',
  ax9: 'Coolie Switch',
  //
  bt0: 'Slew Button',
  //
  bt1: 'MIC Switch [Push]',
  bt2: 'MIC Switch [Up]',
  bt3: 'MIC Switch [Far]',
  bt4: 'MIC Switch [Down]',
  bt5: 'MIC Switch [Near]',
  //
  bt6: 'Speedbrake [Far]',
  bt7: 'Speedbrake [Near]',
  bt8: 'Boat Switch [Far]',
  bt9: 'Boat Switch [Near]',
  bt10: 'China Hat [Far]',
  bt11: 'China Hat [Near]',
  //
  bt12: 'Pinky Switch [Far]',
  bt13: 'Pinky Switch [Near]',
  bt14: 'Red Throttle Button',
  //
  bt15: 'Fuel Flow [Left]',
  bt16: 'Fuel Flow [Right]',
  bt17: 'Engine [Left]',
  bt18: 'Engine [Right]',
  bt19: 'APU Start',
  bt20: 'Landing Gear | WRN',
  //
  bt21: 'Flaps [Up]',
  bt22: 'Flaps [Down]',
  //
  bt23: 'EAC Arm',
  bt24: 'RDR ALTM',
  bt25: 'Autopilot [On/Off]',
  bt26: 'Path [Autopilot]',
  bt27: 'Alt [Autopilot]',
  bt28: 'Park [Right]',
  bt29: 'Park [Left]',
  bt30: 'Ignition [Left]',
  bt31: 'Ignition [Right]',
};

// Dev note: the manual counts from 1 instead of 0.
friendlyButtonNames['HOTAS Warthog Flight Stick'] = {
  ax0: 'Stick [Roll]',
  ax1: 'Stick [Pitch]',
  ax9: 'Trim Switch',
  //
  bt0: 'Gun Trigger (Stage 1)',
  bt1: 'Weapons Release',
  bt2: 'Nosewheel Button',
  bt3: 'Paddle Switch',
  bt4: 'Master Mode Control',
  bt5: 'Gun Trigger (Fire)',
  //
  bt6: 'Target [Up]',
  bt7: 'Target [Right]',
  bt8: 'Target [Down]',
  bt9: 'Target [Left]',
  //
  bt10: 'Data Management [Up]',
  bt11: 'Data Management [Right]',
  bt12: 'Data Management [Down]',
  bt13: 'Data Management [Left]',
  //
  bt14: 'Countermeasures [Far]',
  bt15: 'Countermeasures [Right]',
  bt16: 'Countermeasures [Near]',
  bt17: 'Countermeasures [Left]',
  bt18: 'Countermeasures [Push]',
};

// ----------------------------------------------------------------------------

export {
  knownGamepadNames,
  guessGamepadName,
  friendlyButtonNames
};
