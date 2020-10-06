import React, { useEffect, useState } from 'react';
import { Image, Placeholder, List } from 'semantic-ui-react';
import FileDetailsModal from '../modals/file-details-modal';
import { getObjectURL } from '../utils/amazon-s3-utils';
/**
 * This component is for viewing the files in a list format.
 * STILL A WIP
 * @param {*} props
 */
const ListFile = (props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [src, setSrc] = useState({});

  const getImageUrl = () => getObjectURL(props.bucket, props.file.Key);

  useEffect(() => {
    if (props.file.type === 'file') {
      getImageUrl().then((data) => {
        setImageLoaded(true);
        setSrc(data);
      });
    }
  }, [props.file.Key]);

  /**
   * Gets the appropriate tags for whatever type of file requested
   */
  const getImage = () => {
    if (props.settings.loadImages) {
      if (props.file.type === 'file') {
        if (imageLoaded) {
          return <Image src={src} wrapped ui={false} />;
        } else {
          return (
            <Placeholder>
              <Placeholder.Image square />
            </Placeholder>
          );
        }
      }
    } else {
      if (props.file.type === 'file') {
        return (
          <Image
            src="https://react.semantic-ui.com/images/wireframe/square-image.png"
            wrapped
            ui={false}
          />
        );
      }
    }
  };

  const handleFileClick = () => {
    const { file, customClickEvent } = props;
    if (file.type === 'folder') {
      let newDepth = file.Key.split('/').length - 1;
      let newPathInfo = {
        path: file.Key,
        depth: newDepth
      };
      customClickEvent(newPathInfo);
    } else if (file.type === 'file') {
      setModalOpen(true);
    }
  };

  const { file, bucket } = props;
  let keys = file.Key.split('/');
  let filename = '';
  if (file.type === 'file') {
    filename = keys.length === 1 ? keys[0] : keys[keys.length - 1];
  } else {
    filename = keys.length === 1 ? keys[0] : keys[keys.length - 2] + '/';
  }
  return [
    <List.Item onClick={handleFileClick} className="file-list-item">
      {file.type === 'file' ? (
        <List.Icon name="image" size="large" verticalAlign="middle" />
      ) : (
        <List.Icon name="folder" size="large" verticalAlign="middle" />
      )}
      <List.Content>
        <List.Header as="a">{filename}</List.Header>
        <List.Description as="a">{`Size: ${file.Size} bytes`}</List.Description>
      </List.Content>
    </List.Item>,
    file.type === 'file' && (
      <FileDetailsModal
        updateList={props.updateList}
        bucket={bucket}
        modalOpen={modalOpen}
        handleClose={() => setModalOpen(false)}
        file={{
          ...file,
          filename: filename,
          src: src
        }}
      />
    )
  ];
};
export default ListFile;
