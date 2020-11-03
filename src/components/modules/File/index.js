import React, { useEffect, useState } from 'react';
import { Card, Image, Placeholder, Icon } from 'semantic-ui-react';
import { getImageSrc } from '../../utils/amazon-s3-utils';
import './file.scss';

const File = ({ file, bucket, updateSrcArray, settings, openModal }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [src, setSrc] = useState(file.src);

  const fileTest = /\.(jpe?g|png|gif|bmp)$/i;
  useEffect(() => {
    if (fileTest.test(file.filename)) {
      if (file.src) {
        setImageLoaded(true);
        setSrc(file.src);
      } else {
        getImageSrc(
          bucket,
          file.Key,
          (data) => {
            updateSrcArray(file.Key, data);
            setSrc(data);
            setImageLoaded(true);
          },
          settings.cacheImages
        );
      }
    } else {
      setImageLoaded(true);
    }
  }, [
    fileTest,
    bucket,
    file.Key,
    file.filename,
    file.src,
    settings.cacheImages,
    updateSrcArray
  ]);
  /**
   * Gets the appropriate tags for whatever type of file requested
   */
  const getImage = () => {
    if (imageLoaded) {
      if (fileTest.test(file.filename)) {
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
      className={`file-card ${file.hidden ? 'hidden' : ''}`}
      onClick={() =>
        openModal({
          ...file,
          src: src
        })
      }
    >
      {getImage()}
      <Card.Content>
        <Card.Header>{file.filename}</Card.Header>
        <Card.Meta>
          <span>Last modified:</span>
          <span>{new Date(file.LastModified).toDateString()}</span>
        </Card.Meta>
      </Card.Content>
    </Card>
  );
};
export default File;
