import AWS from 'aws-sdk';
import React, { useEffect, useState } from 'react';
import { Card, Image, Placeholder } from 'semantic-ui-react';
import FileDetailsModal from '../modals/FileDetailsModal';
import { getObjectURL } from '../utils/amazon-s3-utils';

const File = (props) => {
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

  const { file, bucket } = props;
  let keys = file.Key.split('/');
  let filename = '';
  if (file.type === 'file') {
    filename = keys.length === 1 ? keys[0] : keys[keys.length - 1];
  } else {
    filename = keys.length === 1 ? keys[0] : keys[keys.length - 2] + '/';
  }
  return [
    <Card className="file-card" onClick={handleFileClick}>
      {getImage()}
      <Card.Content>
        <Card.Header>{filename}</Card.Header>
        <Card.Meta>{`Last modified: ${file.LastModified}`}</Card.Meta>
        <Card.Meta>{`Size: ${file.Size} bytes`}</Card.Meta>
      </Card.Content>
    </Card>,
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
export default File;
