import {useEffect, useState} from 'react';
import {readButtonNamesFromFile, saveButtonNamesToFile} from '../../local/fileOperations'
import {generateDefaultButtonNames} from '../../local/gamepadUtils'

const ButtonNamesManager = ({gamepad}) => {
  const [buttonNames, setButtonNames] = useState(() => generateDefaultButtonNames(gamepad));

  useEffect(() => {
    if (gamepad) {
      // Whenever the gamepad prop changes, read button names from file and update state
      readButtonNamesFromFile(gamepad).then(storedButtonNames => {
        setButtonNames(storedButtonNames);
      });
    }
  }, [gamepad]);

  const handleRenameButtonClick = async (index, newName, isAxis) => {
    const key = isAxis ? `ax${index}` : `bt${index}`;
    const newButtonNames = {...buttonNames};
    newButtonNames[key] = newName;
    await saveButtonNamesToFile(newButtonNames);
    setButtonNames(newButtonNames);
  };

  return {
    buttonNames,
    handleRenameButtonClick,
  };
};

export {
  ButtonNamesManager,
  generateDefaultButtonNames
}
