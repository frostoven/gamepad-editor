import {Input, Popup, Segment} from "semantic-ui-react";
import React from "react";

const ButtonInfo = ({button, buttonName, onRenameButtonClick}) => {
  return (
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
                onRenameButtonClick(e.target.value);
              }
            }}
          />
        </div>
      }
    />
  );
};

export default ButtonInfo;
