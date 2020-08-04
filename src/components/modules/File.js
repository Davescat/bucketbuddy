import AWS from 'aws-sdk';
import React, { useEffect, useState } from 'react';
import { Card, Image, Placeholder } from 'semantic-ui-react';
import FileDetailsModal from '../modals/FileDetailsModal';

export default function File(props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [src, setSrc] = useState({});

  const getData = () => {
    const {
      file: { Key },
      bucket: { accessKeyId, secretAccessKey, region, name }
    } = props;

    return (async function () {
      try {
        AWS.config.update({
          accessKeyId,
          secretAccessKey,
          region
        });
        const s3 = new AWS.S3();
        const res = await s3
          .getObject({
            Bucket: name,
            Key: Key
          })
          .promise()
          .then((response) => {
            return response;
          });

        return res;
      } catch (e) {
        console.log('My error', e);
      }
    })();
  };

  const getImageUrl = () => {
    const {
      file: { Key },
      bucket: { accessKeyId, secretAccessKey, region, name }
    } = props;

    return (async function () {
      try {
        AWS.config.update({
          accessKeyId,
          secretAccessKey,
          region
        });
        const s3 = new AWS.S3();
        const url = await s3.getSignedUrlPromise('getObject', {
          Bucket: name,
          Key: Key
        });
        return url;
      } catch (e) {
        console.log('My error', e);
      }
    })();
  };

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
}
