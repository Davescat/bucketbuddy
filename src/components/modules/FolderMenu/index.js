import React, { useState, useEffect } from 'react';
import { Menu, FormInput } from 'semantic-ui-react';
import './folder-menu.css';

const FolderMenu = (props) => {
  const [visibleFolders, setvisibleFolders] = useState(props.folders);
  const [currentPath, setCurrentPath] = useState(props.pathInfo);

  useEffect(() => {
    if (currentPath !== props.pathInfo) {
      setCurrentPath(props.pathInfo);
      props.search.setSearchText('');
    }
    if (visibleFolders !== props.folders && props.search.text === '') {
      setvisibleFolders(props.folders);
    }
  }, [
    currentPath,
    props.pathInfo,
    props.folders,
    props.search,
    visibleFolders
  ]);

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
        <Menu.Item
          onClick={() => handleFileClick(x.Key)}
          key={`${i}${x.filename}`}
        >
          {x.filename}
        </Menu.Item>
      ))}
    </Menu>
  );
};
export default FolderMenu;
