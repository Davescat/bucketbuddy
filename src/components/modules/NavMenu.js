import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

class NavMenu extends Component {
  render() {
    return (
      <Menu pointing>
        <Menu.Item name="Icon">
          <i
            aria-hidden="true"
            style={{ fontSize: "1.5em" }}
            className="folder open icon"
          ></i>
        </Menu.Item>
        <Menu.Item name="Home" as={Link} to="/home">
          Home
        </Menu.Item>
        <Menu.Item name="Buckets" as={Link} to="/buckets">
          Buckets
        </Menu.Item>
      </Menu>
    );
  }
}

export default NavMenu;
