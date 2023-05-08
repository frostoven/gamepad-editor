import {Segment} from "semantic-ui-react";
import React from "react";

const StatusBar = ({connectedControllers}) => {
  return (
    <Segment className="status-bar">
      Connected controllers: {connectedControllers}
    </Segment>
  );
};

export default StatusBar;
