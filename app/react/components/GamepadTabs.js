import React, {Component} from 'react'
import {Menu} from 'semantic-ui-react'
import GamepadApiTester from "./GamepadApiTester";

export default class GamepadTabs extends Component {
  state = {
    activeItem: null,
    gamepads: new Array(4).fill(null),
  }

  componentDidMount() {
    window.addEventListener('gamepadconnected', this.handleGamepadConnected)
    window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected)
  }

  componentWillUnmount() {
    window.removeEventListener('gamepadconnected', this.handleGamepadConnected)
    window.removeEventListener('gamepaddisconnected', this.handleGamepadDisconnected)
  }

  handleGamepadConnected = (event) => {
    const gamepad = event.gamepad
    const gamepads = [...this.state.gamepads]
    gamepads[gamepad.index] = gamepad
    this.setState({gamepads})
    if (gamepad.index === 0) {
      this.setState({activeItem: `Controller ${gamepad.index + 1}: ${gamepad.id}`})
    }
  }

  handleGamepadDisconnected = (event) => {
    const gamepad = event.gamepad
    const gamepads = [...this.state.gamepads]
    gamepads[gamepad.index] = null
    this.setState({gamepads})
    if (this.state.activeItem === `Controller ${gamepad.index + 1}: ${gamepad.id}`) {
      this.setState({activeItem: null})
    }
  }

  handleItemClick = (e, {name}) => this.setState({activeItem: name})

  render() {
    const {activeItem, gamepads} = this.state

    let activeComponent;
    if (activeItem) {
      activeComponent = activeItem ? <GamepadApiTester gamepadIndex={gamepads.findIndex(gp => gp && gp.id === activeItem.split(': ')[1])} /> : null;
    }


    // @ts-ignore
    const menuItems: React.ReactNode[] = gamepads.map((gamepad, index) => {
      const name = gamepad ? `Controller ${index + 1}: ${gamepad.id}` : `Controller ${index + 1}`
      return (
        <Menu.Item
          key={index}
          name={name}
          active={activeItem === name}
          onClick={this.handleItemClick}
        />
      )
    })

    return (
      <div>
        <Menu>
          {menuItems}
        </Menu>
        {activeComponent}
      </div>
    )
  }
}
