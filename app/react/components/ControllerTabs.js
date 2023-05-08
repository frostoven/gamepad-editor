import {Menu} from "semantic-ui-react";
import React from "react";

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

export default ControllerTabs;
