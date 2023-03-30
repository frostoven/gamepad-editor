import React from 'react';

const nw = window.nw;

const MenuBar = () => {
  const menu = new nw.Menu({ type: 'menubar' });

  // Create file menu
  const fileMenu = new nw.Menu();
  fileMenu.append(new nw.MenuItem({
    label: 'Exit',
    click: () => {
      nw.App.quit();
    },
  }));
  menu.append(new nw.MenuItem({
    label: 'File',
    submenu: fileMenu,
  }));

  // Create help menu
  const helpMenu = new nw.Menu();
  helpMenu.append(new nw.MenuItem({
    label: 'About',
    click: () => {
      nw.Window.open('about.html');
    },
  }));
  menu.append(new nw.MenuItem({
    label: 'Help',
    submenu: helpMenu,
  }));

  // Attach menu to window
  nw.Window.get().menu = menu;

  return null;
};

export default MenuBar;
