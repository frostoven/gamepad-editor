import React, { useState, useEffect } from 'react';

// initialize THANGZ.
const GamepadTester = () => {
  const [ gamepad, setGamepad ] = useState(null);
  const [ buttons, setButtons ] = useState([]);
  const [ axes, setAxes ] = useState([]);

  // two event listeners to detect pad connection and disconnection.

  useEffect(() => {
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  // useEffect hook is responsible for continuously updating the status of the connected gamepad.

  useEffect(() => {
    if (!gamepad) return;

    const animationFrameId = window.requestAnimationFrame(() => updateGamepadStatus(gamepad));

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [ gamepad ]);

  // setGamepad function is called to update the gamepad state with the newly connected gamepad.
  const handleGamepadConnected = (event) => {
    console.log('Gamepad connected:', event.gamepad);
    setGamepad(event.gamepad);
  };

  const handleGamepadDisconnected = (event) => {
    console.log('Gamepad disconnected:', event.gamepad);
    setGamepad(null);
  };

  // Checks if the button value is greater than 0.1 (indicating that the button is being pressed), and pushes a string value of "1.00" to newButtons if it is pressed,
  // or "0.00" if it is not pressed.
  // For each axis, it uses the toFixed method to round the value to two decimal places and then pushes the result to newAxes.
  // FIXME: Detects and displays change eg: 0.00 to 1.00, but then gets stuck at 1.00 and no other buttons register.

  const updateGamepadStatus = (gamepad) => {
    const newButtons = [];
    const newAxes = [];

    for (let i = 0; i < gamepad.buttons.length; i++) {
      const button = gamepad.buttons[i];
      const value = typeof button === 'object' ? button.value : button;
      const pressed = value > 0.1;
      newButtons.push(pressed ? '1.00' : '0.00');
    }

    for (let i = 0; i < gamepad.axes.length; i++) {
      const axis = gamepad.axes[i];
      newAxes.push(axis.toFixed(2));
    }

    setButtons(newButtons);
    setAxes(newAxes);
  };

  return (
    <div className="gamepad-tester">
      <h1>Gamepad Tester</h1>
      {gamepad ? (
        <div>
          <h2>Connected</h2>
          <div className="gamepad-info">
            <div className="gamepad-buttons">
              <h3>Buttons</h3>
              {buttons.map((buttonValue, index) => (
                <div key={index}>
                  <span>{`Button ${index}:`}</span>
                  <span>{buttonValue}</span>
                </div>
              ))}
            </div>
            <div className="gamepad-axes">
              <h3>Axes</h3>
              {axes.map((axisValue, index) => (
                <div key={index}>
                  <span>{`Axis ${index}:`}</span>
                  <span>{axisValue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <h2>No gamepad detected</h2>
      )}
    </div>
  );
};

export default GamepadTester;
