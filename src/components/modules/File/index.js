import React, { useEffect, useState } from 'react';
import { Card, Image, Placeholder, Icon } from 'semantic-ui-react';
import { getImageSrc } from '../../utils/amazon-s3-utils';
import './file.scss';

const File = (props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [src, setSrc] = useState(props.file.src);

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
            props.updateSrcArray(props.file.Key, data);
            setSrc(data);
            setImageLoaded(true);
          },
          props.settings.cacheImages
        );
      }
    } else {
      setImageLoaded(true);
    }
  }, []);
  /**
   * Gets the appropriate tags for whatever type of file requested
   */
  const getImage = () => {
    if (imageLoaded) {
      if (fileTest.test(props.file.filename)) {
        return <Image src={src} wrapped className="card-file-image" />;
      } else {
        return (
          <div className="ui image ">
            <Icon name="file" className="card-file-icon" />
          </div>
        );
      }
    } else {
      return (
        <Placeholder>
          <Placeholder.Image square />
        </Placeholder>
      );
    }
  };

  return (
    <Card
      raised
      className={`file-card ${props.file.hidden ? 'hidden' : ''}`}
      onClick={() =>
        props.openModal({
          ...props.file,
          src: src
        })
      }
    >
      {getImage()}
      <Card.Content>
        <Card.Header>{props.file.filename}</Card.Header>
        <Card.Meta>
          <span>Last modified:</span>
          <span>{new Date(props.file.LastModified).toDateString()}</span>
        </Card.Meta>
      </Card.Content>
    </Card>
  );
};
export default File;
