import React, {useState, useEffect, useRef} from 'react';
import {Segment, Grid, List, Checkbox} from 'semantic-ui-react';
import AxisInfo from "./AxisInfo";
import ButtonInfo from "./ButtonInfo";
import {readButtonNamesFromFile, saveButtonNamesToFile, getButtonNamesFromFile} from '../../local/fileOperations'
import {generateDefaultButtonNames} from '../../local/gamepadUtils'


// displays information about a specific gamepad
const ControllerInfo = ({ gamepad }) => {
  const [buttons, setButtons] = useState([]);
  const [axes, setAxes] = useState([]);
  const [deadzoneEnabled, setDeadzoneEnabled] = useState(false);
  const [deadzoneValue, setDeadzoneValue] = useState(0.15);
  const buttonCache = useRef({});
  const axisCache = useRef({});
  const [buttonNames, setButtonNames] = useState(() => generateDefaultButtonNames(gamepad));

  useEffect(() => {
    if (gamepad) {
      // Whenever the gamepad prop changes, read button names from file and update state
      readButtonNamesFromFile(gamepad).then(storedButtonNames => {
        setButtonNames(storedButtonNames);
      });
    }
  }, [gamepad]);

  useEffect(() => {
    // When the gamepad.id prop changes, update buttonNames
    const updateButtonNames = async () => {
      if (gamepad) {
        const storedButtonNames = await getButtonNamesFromFile(gamepad.id);
        if (storedButtonNames !== null) {
          // If there are button names stored in the file for this controller, use those
          setButtonNames(storedButtonNames);
        } else {
          // If there are no button names stored in the file for this controller, use default names
          const defaultButtonNames = generateDefaultButtonNames(gamepad);
          setButtonNames(defaultButtonNames);
        }
      }
    };
    updateButtonNames().catch((error) => console.error(error));
  }, [gamepad]);

  const processGamepadData = () => {
    // console.log("processGamepadData called");
    if (!gamepad) return;

    let buttonChanged = false;

    // Process buttons
    gamepad.buttons.forEach((button, index) => {
      // console.log(`Button ${index}: current value: ${button.value}, cached value: ${buttonCache.current[index]}`);
      if (buttonCache.current[index] !== button.value) {
        buttonChanged = true;
        buttonCache.current[index] = button.value;
      }
    });

    // Process axes (same logic as for buttons)
    let axisChanged = false;

    gamepad.axes.forEach((axis, index) => {
      const axisValue = deadzoneEnabled && Math.abs(axis) < deadzoneValue ? 0 : axis;
      // console.log(`Axis ${index}: current value: ${axisValue}, cached value: ${axisCache.current[index]}`);

      if (axisCache.current[index] !== axisValue) {
        axisChanged = true;
        axisCache.current[index] = axisValue;
      }
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

  const handleRenameButtonClick = async (index, newName, isAxis) => {
    const key = isAxis ? `ax${index}` : `bt${index}`;
    const newButtonNames = {...buttonNames};
    newButtonNames[key] = newName;
    await saveButtonNamesToFile(newButtonNames, gamepad.id);
    setButtonNames(newButtonNames);
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
                    buttonName={buttonNames[`bt${index}`] || `Button ${index}`}
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
                  <AxisInfo axisValue={axis} index={index} axisName={buttonNames[`ax${index}`] || `Axis ${index}`} />
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

export default ControllerInfo;
