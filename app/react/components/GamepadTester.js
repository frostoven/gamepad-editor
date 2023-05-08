import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import ControllerInfo from "./ControllerInfo";
import StatusBar from "./StatusBar";
import LogContainer from "./LogContainer";
import ControllerTabs from "./ControllerTabs";

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

export default GamepadTester;
