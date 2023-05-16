import React from 'react';
/*import GamepadLog from './components/GamepadLog';*/
import GamepadManager from '../GamepadManager';
import MenuBar from './components/MenuBar';
import GamepadTester from "./components/GamepadTester";
import { checkAndCreateDir } from '../directoryManager';

export default class RootNode extends React.Component {
  constructor(props) {
    super(props);
    this.gamepadManager = new GamepadManager();
  }

  async componentDidMount() {
    const profileDir = checkAndCreateDir();
    await profileDir;
    // this.gamepadManager.onInputChange.getEveryChange((data) => {
    //   console.log('-> Gamepad data:', data);
    // });
  }

  render() {
    return (
      <div>
        <GamepadTester />
        <MenuBar />
      </div>
    );
  }
}
