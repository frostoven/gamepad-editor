import {Segment} from "semantic-ui-react";
import React from "react";

const LogContainer = ({logMessages, anyControllerConnected, hasConnectedOnce}) => {
  return (
    <Segment basic className="log-container">
      {logMessages.map((message, index) => {
        if (index === 0 && (anyControllerConnected || hasConnectedOnce)) {
          return null;
        }
        return <p key={index}>{message}</p>;
      })}
    </Segment>
  );
};

export default LogContainer;
