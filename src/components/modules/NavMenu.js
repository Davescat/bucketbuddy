import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

class NavMenu extends Component {
  render() {
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
          Home
        </Menu.Item>
        <Menu.Item name="Bucket" as={Link} to="/bucket-viewer">
          Buckets
        </Menu.Item>
      </Menu>
    );
  }
}

export default NavMenu;
