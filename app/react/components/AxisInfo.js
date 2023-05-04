import {Segment} from "semantic-ui-react";
import React from "react";

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

export default AxisInfo;
