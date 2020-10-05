import React, { useEffect, useState } from 'react';
import { Card, Image, Placeholder, Icon } from 'semantic-ui-react';
import FileDetailsModal from '../modals/file-details-modal';
import { getImageSrc } from '../utils/amazon-s3-utils';

const File = (props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [src, setSrc] = useState('');

  const fileTest = /\.(jpe?g|png|gif|bmp)$/i;

  useEffect(() => {
    if (fileTest.test(props.file.filename)) {
      if (props.file.src) {
        setImageLoaded(true);
        setSrc(props.file.src);
      } else {
        getImageSrc(
          props.bucket,
          props.file.Key,
          (data) => {
            setSrc(data);
            setImageLoaded(true);
          },
          props.settings.cacheImages
        );
      }
    } else {
      setImageLoaded(true);
    }
  }, [props.file.Key]);

  /**
   * Gets the appropriate tags for whatever type of file requested
   */
  const getImage = () => {
    if (imageLoaded) {
      if (fileTest.test(props.file.filename)) {
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
  };

  return [
    <Card className="file-card" onClick={() => setModalOpen(true)}>
      {getImage()}
      <Card.Content>
        <Card.Header>{props.file.filename}</Card.Header>
        <Card.Meta>{`Last modified: ${props.file.LastModified}`}</Card.Meta>
        <Card.Meta>{`Size: ${props.file.Size} bytes`}</Card.Meta>
      </Card.Content>
    </Card>,
    <FileDetailsModal
      updateList={props.updateList}
      bucket={props.bucket}
      modalOpen={modalOpen}
      schemaInfo={props.schemaInfo}
      handleClose={() => setModalOpen(false)}
      tagInfo={{
        fileTags: props.file.TagSet,
        updateTagState: props.updateTagState
      }}
      file={{
        ...props.file,
        src: src
      }}
    />
  ];
};
export default File;
