import React from 'react';
/*import GamepadLog from './components/GamepadLog';*/
import GamepadManager from '../GamepadManager';
import MenuBar from './components/MenuBar';
import GamepadTabs from "./components/GamepadTabs";

export default class RootNode extends React.Component {
  constructor(props) {
    super(props);
    this.gamepadManager = new GamepadManager();
  }

  componentDidMount() {
    // this.gamepadManager.onInputChange.getEveryChange((data) => {
    //   console.log('-> Gamepad data:', data);
    // });
  }

  render() {
    return (
      <div>
        <GamepadTabs />
        <MenuBar />
      </div>
    );
  }
}
