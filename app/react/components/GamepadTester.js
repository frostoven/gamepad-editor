import React, {useState, useEffect} from 'react';
import {Tab, Loader, Segment, Grid, List, Checkbox, Popup, Input} from 'semantic-ui-react';

const GamepadTester = () => {
  const [gamepads, setGamepads] = useState(Array(4).fill(null));
  const [logMessages, setLogMessages] = useState(['Press a button or move an analog stick to connect the controller.']);
  const [anyControllerConnected, setAnyControllerConnected] = useState(false);

  // useEffect hook used to update the gamepads state variable
  // with current connected gamepads
  useEffect(() => {
    // function that updates the gamepads state variable
    // with current connected gamepads
    const updateGamepads = () => {
      const newGamepads = navigator.getGamepads();
      const newGamepadsArray = [...newGamepads];
      let isConnected = false;

      newGamepadsArray.forEach((gamepad, index) => {
        if (gamepad && gamepad.connected) {
          isConnected = true;
          if (!gamepads[index]) {
            setLogMessages((prevLog) => [
              ...prevLog,
              `Controller ${gamepad.id} connected in slot ${gamepad.index}.`,
            ]);
          }
        } else if (gamepads[index] && !gamepad) {
          setLogMessages((prevLog) => [
            ...prevLog,
            `Controller ${gamepads[index].id} disconnected from slot ${gamepads[index].index}.`,
          ]);
        }
      });

      setAnyControllerConnected(isConnected);
      setGamepads(newGamepadsArray);
    };

    // interval that updates the gamepads state variable every 100ms
    const intervalId = setInterval(updateGamepads, 100);

    // event listeners that listen for connected and disconnected gamepads
    window.addEventListener('gamepadconnected', updateGamepads);
    window.addEventListener('gamepaddisconnected', updateGamepads);

    // cleanup function that removes event listeners and clears the interval
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('gamepadconnected', updateGamepads);
      window.removeEventListener('gamepaddisconnected', updateGamepads);
    };
  }, [gamepads]);

  // creates an array of Tab panes for each connected gamepad
  const panes = gamepads.map((gamepad, index) => {
    const tabName = gamepad ? gamepad.id : `Controller ${index + 1}`;
    return {
      menuItem: tabName,
      render: () => (
        <Tab.Pane>
          <ControllerInfo gamepad={gamepad}/>
        </Tab.Pane>
      ),
    };
  });

// displays log
  const Log = ({ messages }) => {
    return (
      <Segment className="log-container">
        {anyControllerConnected ? (
          messages
            .filter((message, index) => index !== 0)
            .map((message, index) => <p key={index}>{message}</p>)
        ) : (
          <p>{messages[0]}</p>
        )}
      </Segment>
    );
  };

  // displays the array of Tab panes
  const connectedControllers = gamepads.filter(gamepad => gamepad).length;

  return (
    <div className="app-container">
      <div className="main-content">
        <Tab panes={panes}/>
        <Log messages={logMessages}/>
      </div>
      <Segment className="status-bar">Connected controllers: {connectedControllers}</Segment>
    </div>
  );
};

// displays information about a specific gamepad
const ControllerInfo = ({ gamepad }) => {
  const [buttons, setButtons] = useState([]);
  const [axes, setAxes] = useState([]);
  const [deadzoneEnabled, setDeadzoneEnabled] = useState(false);
  const [deadzoneValue, setDeadzoneValue] = useState(0.15);
  const [buttonNames, setButtonNames] = useState(
    Array(gamepad?.buttons.length).fill("")
  );

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
  }, [gamepad, deadzoneEnabled, deadzoneValue]);

  // displays message if no gamepad is connected
  if (!gamepad) {
    return (
      <Segment basic>
        <Loader active />
        <p>No controller connected</p>
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
            {gamepad.buttons.map((button, index) => {
              const buttonName = buttonNames[index] || `Button ${index}`;
              return (
                <List.Item key={index}>
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
                              handleRenameButtonClick(index, e.target.value);
                            }
                          }}
                        />
                      </div>
                    }
                  />
                </List.Item>
              );
            })}
          </List>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <h3>Axes</h3>
          <List horizontal>
            {axes.map((axis, index) => (
              <List.Item key={index}>
                <Segment className="axis-container">
                  Axis {index}: {axis.toFixed(2)}
                  <div
                    className="positive-axis-bar"
                    style={{
                      height: axis >= 0 ? `${axis * 50}%` : '0%'
                    }}
                  ></div>
                  <div
                    className="negative-axis-bar"
                    style={{
                      height: axis < 0 ? `${Math.abs(axis) * 50}%` : '0%'
                    }}
                  ></div>
                </Segment>
              </List.Item>
            ))}
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

export default GamepadTester;
