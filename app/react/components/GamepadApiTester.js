import React, {useState, useEffect} from 'react';
import { Loader, Segment } from 'semantic-ui-react'

const GamepadTester = () => {
  const [gamepad, setGamepad] = useState(null);
  const [buttons, setButtons] = useState([]);
  const [axes, setAxes] = useState([]);
  const [buttonCache, setButtonCache] = useState(Array(32).fill(0));
  const [axisCache, setAxisCache] = useState(Array(4).fill(0));

  const handleGamepadConnected = (event) => {
    console.log('Controller Connected');
    setGamepad(event.gamepad);
  };

  const handleGamepadDisconnected = () => {
    console.log('Controller Disconnected');
    setGamepad(null);
  };

  const updateController = (gamepadIndex) => {
    const gamepad = navigator.getGamepads()[gamepadIndex];
    if (!gamepad) return;
    const updatedButtons = [...gamepad.buttons].map((button) => button.value);
    setButtons(updatedButtons);

    const updatedAxes = [...gamepad.axes];
    setAxes(updatedAxes);

    // Update button cache and log changes
    updatedButtons.forEach((buttonValue, index) => {
      if (buttonCache[gamepadIndex][index] !== buttonValue) {
        console.log(`Button ${index} changed: ${buttonValue}`);
        setButtonCache((prevCache) => {
          const newCache = [...prevCache];
          newCache[gamepadIndex][index] = buttonValue;
          return newCache;
        });
      }
    });

    // Update axis cache and log changes
    updatedAxes.forEach((axisValue, index) => {
      if (axisCache[gamepadIndex][index] !== axisValue) {
        console.log(`Axis ${index} changed: ${axisValue}`);
        setAxisCache((prevCache) => {
          const newCache = [...prevCache];
          newCache[gamepadIndex][index] = axisValue;
          return newCache;
        });
      }
    });
  };

  const handleItemClick = (event, { name }) => {
    setActiveItem(name);
    const gamepadIndex = parseInt(name.match(/\d/)) - 1;
    setActiveGamepad(gamepadIndex);
    updateController(gamepadIndex);
  };

  useEffect(() => {
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(updateController, 16); // 60 fps
    return () => clearInterval(intervalId);
  }, [gamepad, buttonCache, axisCache]);

  return (
    <div className="gamepad-tester">
      <h1>Gamepad Tester</h1>
      {gamepad ? (
        <div>
          <h2>Connected</h2>
          <div className="gamepad-info">
            <div className="gamepad-buttons">
              <h3>Buttons</h3>
              {buttons.map((buttonValue, index) => {
                // Calculate the button fill percentage based on its value
                const fillPercentage = buttonValue * 100;
                // Set a class name to animate the button fill bar when it's pressed
                const buttonClass = buttonValue ? "button-pressed" : "";
                // Render the button element with the fill bar
                return (
                  <div key={index} className="button-wrapper">
                    <span>{`Button ${index}:`}</span>
                    <div className={`button-fill-bar ${buttonClass}`} style={{width: `${fillPercentage}%`}}></div>
                  </div>
                );
              })}
            </div>
            <div className="gamepad-axes">
              <h3>Axes</h3>
              {axes.map((axisValue, index) => (
                <div key={index}>
                  <span>{`Axis ${index}:`}</span>
                  <span>{axisValue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Segment>
          <Loader active />
          <h2>No gamepad detected</h2>
        </Segment>
      )}
    </div>
  );
};

/*return (
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
                <span>{axisValue.toFixed(2)}</span>
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
};*/

export default GamepadTester;
