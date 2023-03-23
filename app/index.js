import './polyfills';
import './earlyLoad';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { onDocumentReady } from './local/windowLoadListener';
import RootNode from './react';

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

onDocumentReady(() => {
  window.rootNode = ReactDOM.render(
    <RootNode />,
    document.getElementById('reactRoot'),
  );
});

