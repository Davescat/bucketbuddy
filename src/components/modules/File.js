import React, { useEffect, useState } from 'react';
import { Card, Image, Placeholder, Icon } from 'semantic-ui-react';
import FileDetailsModal from '../modals/FileDetailsModal';
import { getObjectURL } from '../utils/amazon-s3-utils';

const File = (props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [src, setSrc] = useState({});

  const getImageUrl = () => getObjectURL(props.bucket, props.file.Key);
  const fileTest = /\.(jpe?g|png|gif|bmp)$/i;

  const keys = props.file.Key.split('/');
  let filename = '';
  if (props.file.type === 'file') {
    filename = keys.length === 1 ? keys[0] : keys[keys.length - 1];
  } else {
    filename = keys.length === 1 ? keys[0] : keys[keys.length - 2] + '/';
  }

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
          if (fileTest.test(filename)) {
            return <Image src={src} className="card-file-image" />;
          } else {
            return <Icon name="file" className="card-file-icon" />;
          }
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
        return <Image wrapped ui={false} />;
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

  return [
    <Card className="file-card" onClick={handleFileClick}>
      {getImage()}
      <Card.Content>
        <Card.Header>{filename}</Card.Header>
        <Card.Meta>{`Last modified: ${props.file.LastModified}`}</Card.Meta>
        <Card.Meta>{`Size: ${props.file.Size} bytes`}</Card.Meta>
      </Card.Content>
    </Card>,
    props.file.type === 'file' && (
      <FileDetailsModal
        updateList={props.updateList}
        bucket={props.bucket}
        modalOpen={modalOpen}
        schemaInfo={props.schemaInfo}
        handleClose={() => setModalOpen(false)}
        file={{
          ...props.file,
          filename: filename,
          src: src
        }}
      />
    )
  ];
};
export default File;
