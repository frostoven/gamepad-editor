import React, { useState, useEffect } from 'react';

// initialize.
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

    const updateLoop = () => {
      updateGamepadStatus(gamepad);
      window.requestAnimationFrame(updateLoop);
    };

    const animationFrameId = window.requestAnimationFrame(updateLoop);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [ gamepad ]);

  // setGamepad function is called to update the gamepad state with the newly connected gamepad.
  const handleGamepadConnected = (event) => {
    console.log('Gamepad connected:', event.gamepad);
    setGamepad(event.gamepad);
    updateGamepadStatus(event.gamepad);
  };

  const handleGamepadDisconnected = (event) => {
    console.log('Gamepad disconnected:', event.gamepad);
    setGamepad(null);
  };

  // Checks if the button value is greater than 0.1.
  const updateGamepadStatus = () => {
    const gamepads = navigator.getGamepads();
    const currentGamepad = gamepads[gamepad.index];

    const newButtons = [];
    const newAxes = [];

    for (let i = 0; i < currentGamepad.buttons.length; i++) {
      const button = currentGamepad.buttons[i];
      const value = typeof button === 'object' ? button.value : button;
      const pressed = value > 0.1;
      newButtons.push(pressed ? '1.00' : '0.00');
    }

    for (let i = 0; i < currentGamepad.axes.length; i++) {
      const axis = currentGamepad.axes[i];
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
