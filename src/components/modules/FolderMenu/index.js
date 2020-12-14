import React, { useState, useEffect } from 'react';
import { Menu, FormInput } from 'semantic-ui-react';
import './folder-menu.scss';

const FolderMenu = ({
  search,
  isLoading,
  folders,
  pathInfo,
  customClickEvent
}) => {
  const [visibleFolders, setvisibleFolders] = useState(folders);
  const [currentPath, setCurrentPath] = useState(pathInfo);

  useEffect(() => {
    if (currentPath !== pathInfo) {
      setCurrentPath(pathInfo);
      search.setSearchText('');
    }
    if (visibleFolders !== folders && search.text === '') {
      setvisibleFolders(folders);
    }
  }, [currentPath, pathInfo, folders, search, visibleFolders]);

  const handleFileClick = (folderName) => {
    const newPathInfo = {
      path: `${pathInfo.path}${folderName}`,
      depth: pathInfo.depth + 1
    };
    customClickEvent(newPathInfo);
  };

  const handleFieldChange = (event, { value }) => {
    search.setSearchText(value);
    setvisibleFolders(
      folders.filter(
        (folder) => folder.toLowerCase().search(value.toLowerCase()) !== -1
      )
    );
  };
  return (
    <Menu vertical stackable borderless className="folder-menu">
      <Menu.Item>
        <FormInput
          value={search.text}
          onChange={handleFieldChange}
          placeholder="Search..."
          type={'text'}
        />
      </Menu.Item>
      {!isLoading &&
        visibleFolders.map((folderName, i) => (
          <Menu.Item
            onClick={() => handleFileClick(folderName)}
            key={`${i}${folderName}`}
          >
            {folderName}
          </Menu.Item>
        ))}
    </Menu>
  );
};
export default FolderMenu;
