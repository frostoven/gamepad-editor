import React, {useState, useEffect} from 'react';

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

  const updateController = () => {
    const gamepad = navigator.getGamepads()[0]; // The handleGamepadConnected function may not have been completed by the time the updateController function is called.
    if (!gamepad) return;
    const updatedButtons = [...gamepad.buttons].map((button) => button.value);
    setButtons(updatedButtons);

    const updatedAxes = [...gamepad.axes];
    setAxes(updatedAxes);

    // Update button cache and log changes
    updatedButtons.forEach((buttonValue, index) => {
      if (buttonCache[index] !== buttonValue) {
        console.log(`Button ${index} changed: ${buttonValue}`);
        setButtonCache((prevCache) => {
          const newCache = [...prevCache];
          newCache[index] = buttonValue;
          return newCache;
        });
      }
    });

    // Update axis cache and log changes
    updatedAxes.forEach((axisValue, index) => {
      if (axisCache[index] !== axisValue) {
        console.log(`Axis ${index} changed: ${axisValue}`);
        setAxisCache((prevCache) => {
          const newCache = [...prevCache];
          newCache[index] = axisValue;
          return newCache;
        });
      }
    });
    // console.log('Button cache:', buttonCache);
    // console.log('Button values:', updatedButtons);
    // console.log('Gamepad:', gamepad);
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
};

export default GamepadTester;
