import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const NavMenu = () => {
  return (
    <Menu pointing>
      <Menu.Item name="Icon">
        <i
          aria-hidden="true"
          style={{ fontSize: '1.5em' }}
          className="folder open icon"
        ></i>
      </Menu.Item>
      <Menu.Item name="Create Connection" as={Link} to="/">
        Connect to another bucket
      </Menu.Item>
    </Menu>
  );
};
export default NavMenu;
