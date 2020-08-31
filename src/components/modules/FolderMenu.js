import React, { Component, useState, useEffect } from 'react';
import { Input, Menu, FormInput } from 'semantic-ui-react';

const FolderMenu = (props) => {
  const [searchText, setSearchText] = useState('');
  const [visibleFolders, setvisibleFolders] = useState(props.folders);
  const [currentPath, setCurrentPath] = useState(props.pathInfo);

  useEffect(() => {
    if (currentPath !== props.pathInfo) {
      setCurrentPath(props.pathInfo);
      props.search.setSearchText('');
    }
    if (visibleFolders !== props.folders && props.search.text == '') {
      setvisibleFolders(props.folders);
    }
  });

  const handleFileClick = (key) => {
    const newPathInfo = {
      path: key,
      depth: key.split('/').length - 1
    };
    props.customClickEvent(newPathInfo);
  };

  const handleFieldChange = (event, { value }) => {
    props.search.setSearchText(value);
    setvisibleFolders(
      props.folders.filter(
        (x) => x.filename.toLowerCase().search(value.toLowerCase()) !== -1
      )
    );
  };

  return (
    <Menu vertical stackable borderless className="folder-menu">
      <Menu.Item>
        <FormInput
          value={props.search.text}
          onChange={handleFieldChange}
          placeholder="Search..."
          type={'text'}
        />
      </Menu.Item>
      {visibleFolders.map((x, i) => (
        <Menu.Item onClick={() => handleFileClick(x.Key)}>
          {x.filename}
        </Menu.Item>
      ))}
    </Menu>
  );
};
export default FolderMenu;
