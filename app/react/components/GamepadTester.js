import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {Menu, Segment, Grid, List, Checkbox, Popup, Input} from 'semantic-ui-react';

const GamepadTester = () => {
  const [gamepads, setGamepads] = useState(Array(4).fill(null));
  const gamepadsRef = useRef(gamepads);
  const [logMessages, setLogMessages] = useState(['Application booted.']);
  const [anyControllerConnected, setAnyControllerConnected] = useState(false);
  const [hasConnectedOnce, setHasConnectedOnce] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const addToLog = (message) => {
    setLogMessages((prevLogMessages) => [...prevLogMessages, message]);
  };

  // useEffect hook used to update the gamepads state variable
  // with current connected gamepads
  useEffect(() => {
    let animationFrameId;
    // function that updates the gamepads state variable
    // with current connected gamepads
    const updateGamepads = () => {
      const newGamepads = navigator.getGamepads();
      const newGamepadsArray = [...newGamepads];
      let isConnected = false;

      newGamepadsArray.forEach((gamepad, index) => {
        if (gamepad && gamepad.connected) {
          isConnected = true;
          if (!gamepadsRef.current[index]) {
            setLogMessages((prevLog) => [
              ...prevLog,
              `Controller ${gamepad.id} connected in slot ${gamepad.index}.`,
            ]);
            setHasConnectedOnce(true);
          }
        } else if (gamepadsRef.current[index] && !gamepad) {
          setLogMessages((prevLog) => [
            ...prevLog,
            `Controller ${gamepadsRef.current[index].id} disconnected from slot ${gamepadsRef.current[index].index}.`,
          ]);
        }
      });

      setAnyControllerConnected(isConnected);
      setGamepads(newGamepadsArray);
      gamepadsRef.current = newGamepadsArray;

      // Schedule the next gamepad input processing
      animationFrameId = requestAnimationFrame(updateGamepads);
    };

    // Start the gamepad input processing loop
    updateGamepads();

    // Clean up the loop when the component unmounts
    return () => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // adds 48 char truncation
  const truncateText = useCallback((text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  }, []);

  // creates an array of Menu items for each connected gamepad
  const panes = useMemo(() => gamepads.map((gamepad, index) => {
    const fullTabName = gamepad ? gamepad.id : `Controller ${index + 1}`;
    const truncatedTabName = truncateText(fullTabName, 48);
    return {
      fullTabName: fullTabName,
      truncatedTabName: truncatedTabName,
      render: () => (
        <ControllerInfo gamepad={gamepad} addToLog={addToLog} logMessages={logMessages}/>
      ),
    };
  }), [gamepads, truncateText, addToLog, logMessages]);

  // displays the array of Menu items
  const connectedControllers = gamepads.filter(gamepad => gamepad).length;

  const renderActiveController = () => {
    const gamepad = gamepads[activeIndex];
    return <ControllerInfo gamepad={gamepad} addToLog={addToLog} logMessages={logMessages}/>;
  };

  // moved log into return
  // moved status, log, tabs out into separate components
  return (
    <div className="app-container">
      <div className="main-content">
        <ControllerTabs panes={panes} activeIndex={activeIndex} setActiveIndex={setActiveIndex}/>
        {renderActiveController()}
      </div>

      <LogContainer
        logMessages={logMessages}
        anyControllerConnected={anyControllerConnected}
        hasConnectedOnce={hasConnectedOnce}
      />

      <div className="status-bar-spacer"/>
      <StatusBar connectedControllers={connectedControllers}/>
    </div>
  );
};

// displays information about a specific gamepad
const ControllerInfo = ({ gamepad, addToLog }) => {
  const [buttons, setButtons] = useState([]);
  const [axes, setAxes] = useState([]);
  const [deadzoneEnabled, setDeadzoneEnabled] = useState(false);
  const [deadzoneValue, setDeadzoneValue] = useState(0.15);
  const [buttonNames, setButtonNames] = useState(
    Array(gamepad?.buttons.length).fill("")
  );
  const buttonCache = useRef({});
  const axisCache = useRef({});

  const processGamepadData = () => {
    // console.log("processGamepadData called");
    if (!gamepad) return;

    let buttonChanged = false;

    // Process buttons
    gamepad.buttons.forEach((button, index) => {
      // console.log(`Button ${index}: current value: ${button.value}, cached value: ${buttonCache.current[index]}`);
      if (buttonCache.current[index] !== button.value) {
        buttonChanged = true;
        addToLog(`[input] button bt${index} changed to ${button.value}`);
        buttonCache.current[index] = button.value;
      }
    });

    if (buttonChanged) {
      gamepad.buttons.forEach((button, index) => {
        addToLog(`[input] button bt${index} state: ${button.value}`);
      });
    }

    // Process axes (same logic as for buttons)
    let axisChanged = false;

    gamepad.axes.forEach((axis, index) => {
      const axisValue = deadzoneEnabled && Math.abs(axis) < deadzoneValue ? 0 : axis;
      // console.log(`Axis ${index}: current value: ${axisValue}, cached value: ${axisCache.current[index]}`);

      if (axisCache.current[index] !== axisValue) {
        axisChanged = true;
        addToLog(`[input] axis ax${index} changed to ${axisValue}`);
        axisCache.current[index] = axisValue;
      }
    });

    if (axisChanged) {
      gamepad.axes.forEach((axis, index) => {
        const axisValue = deadzoneEnabled && Math.abs(axis) < deadzoneValue ? 0 : axis;
        addToLog(`[input] axis ax${index} state: ${axisValue}`);
      });
    }
  };

  const handleRenameButtonClick = (index, newName) => {
    setButtonNames((prevButtonNames) => {
      const newButtonNames = [...prevButtonNames];
      newButtonNames[index] = newName;
      return newButtonNames;
    });
  };

  const handleDeadzoneToggle = () => {
    setDeadzoneEnabled(!deadzoneEnabled);
  };

  const handleDeadzoneValueChange = (event) => {
    const newValue = parseFloat(event.target.value);
    if (newValue >= 0 && newValue <= 1) {
      setDeadzoneValue(newValue);
    }
  };

  // useEffect hook used to update the buttons and axes state variables
  useEffect(() => {
    // checks if there is a gamepad connected before updating state variables
    if (!gamepad) return;

    setButtons([...gamepad.buttons]);
    setAxes(
      gamepad.axes.map((axis) =>
        deadzoneEnabled && Math.abs(axis) < deadzoneValue ? 0 : axis
      )
    );
    processGamepadData();
  }, [gamepad, deadzoneEnabled, deadzoneValue]);

  // displays message if no gamepad is connected
  if (!gamepad) {
    return (
      <Segment basic>
        <p>Press a button or move an analog stick to connect the controller.</p>
      </Segment>
    );
  }

  // displays information about buttons, axis and other misc
  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column>
          <List horizontal>
            <List.Item>
              <Segment>
                <h3>Index</h3>
                <p>{gamepad.index}</p>
              </Segment>
            </List.Item>
            <List.Item>
              <Segment>
                <h3>Connected</h3>
                <p>{gamepad.connected ? 'Yes' : 'No'}</p>
              </Segment>
            </List.Item>
            <List.Item>
              <Segment>
                <h3>Timestamp</h3>
                <p>{gamepad.timestamp.toFixed(5)}</p>
              </Segment>
            </List.Item>
          </List>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <h3>Buttons</h3>
          <List horizontal>
            {
              buttons.map((button, index) => (
                <List.Item key={index}>
                  <ButtonInfo
                    button={button}
                    buttonName={buttonNames[index] || `Button ${index}`}
                    onRenameButtonClick={(newName) => handleRenameButtonClick(index, newName)}
                  />
                </List.Item>
              ))
            }
          </List>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <h3>Axes</h3>
          <List horizontal>
            {
              axes.map((axis, index) => (
                <List.Item key={index}>
                  <AxisInfo axisValue={axis} index={index}/>
                </List.Item>
              ))
            }
          </List>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={8}>
          <Checkbox
            toggle
            label="Enable Deadzone"
            checked={deadzoneEnabled}
            onChange={handleDeadzoneToggle}
          />
        </Grid.Column>
        <Grid.Column width={8}>
          <label>
            Deadzone Value:
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={deadzoneValue}
              onChange={handleDeadzoneValueChange}
            />
          </label>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

const ControllerTabs = ({panes, activeIndex, setActiveIndex}) => {
  return (
    <Menu stackable>
      {panes.map((pane, index) => (
        <Menu.Item
          key={index}
          active={activeIndex === index}
          onClick={() => setActiveIndex(index)}
        >
          {pane.truncatedTabName}
        </Menu.Item>
      ))}
    </Menu>
  );
};

const LogContainer = ({logMessages, anyControllerConnected, hasConnectedOnce}) => {
  return (
    <Segment basic className="log-container">
      {logMessages.map((message, index) => {
        if (index === 0 && (anyControllerConnected || hasConnectedOnce)) {
          return null;
        }
        return <p key={index}>{message}</p>;
      })}
    </Segment>
  );
};

const StatusBar = ({connectedControllers}) => {
  return (
    <Segment className="status-bar">
      Connected controllers: {connectedControllers}
    </Segment>
  );
};

const ButtonInfo = ({button, buttonName, onRenameButtonClick}) => {
  return (
    <Popup
      trigger={
        <Segment className="button-container">
          {buttonName}: {button.value.toFixed(2)}
          <div
            className="bar"
            style={{height: `${button.value * 100}%`}}
          ></div>
        </Segment>
      }
      on="click"
      hideOnScroll
      position="top center"
      content={
        <div>
          <Input
            placeholder="Enter new name"
            defaultValue={buttonName}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onRenameButtonClick(e.target.value);
              }
            }}
          />
        </div>
      }
    />
  );
};

const AxisInfo = ({axisValue, index}) => {
  return (
    <Segment className="axis-container">
      Axis {index}: {axisValue.toFixed(2)}
      <div
        className="negative-axis-bar"
        style={{
          height: axisValue >= 0 ? `${axisValue * 50}%` : '0%'
        }}
      ></div>
      <div
        className="positive-axis-bar"
        style={{
          height: axisValue < 0 ? `${Math.abs(axisValue) * 50}%` : '0%'
        }}
      ></div>
    </Segment>
  );
};

export default GamepadTester;
