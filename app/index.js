import './polyfills';
import './earlyLoad';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { onDocumentReady } from './local/windowLoadListener';
import RootNode from './react';
import  { checkAndCreateDir }  from './local/fileOperations';


// Generated using https://fsymbols.com/signs/square/
console.log(
  '\n' +
  '█▀▀ ▄▀█ █▀▄▀█ █▀▀ █▀█ ▄▀█ █▀▄\n' +
  '█▄█ █▀█ █░▀░█ ██▄ █▀▀ █▀█ █▄▀\n' +
  '\n' +
  '░░ ░░ █▀█ █▀█ █▀█ █▀▀ █ █░░ █▀▀ █▀█\n' +
  '░░ ░░ █▀▀ █▀▄ █▄█ █▀░ █ █▄▄ ██▄ █▀▄' +
  '\n\n'
);

// Prevent user from making the window too small:
nw.Window.get().setMinimumSize(320, 300);

onDocumentReady(async () => {
  await checkAndCreateDir(); // Wait for directory to be created
  window.rootNode = ReactDOM.render(
    <RootNode />,
    document.getElementById('reactRoot'),
  );
});
