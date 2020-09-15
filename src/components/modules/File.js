import React, { useEffect, useState } from 'react';
import { Card, Image, Placeholder, Icon } from 'semantic-ui-react';
import FileDetailsModal from '../modals/file-details-modal';
import { getObjectURL, getObjectTags } from '../utils/amazon-s3-utils';

const File = (props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [tagsLoaded, setTagsLoaded] = useState(false);
  const [fileTags, setFileTags] = useState({ TagSet: [] });
  const [modalOpen, setModalOpen] = useState(false);
  const [src, setSrc] = useState({});

  const getImageUrl = () => getObjectURL(props.bucket, props.file.Key);
  const fileTest = /\.(jpe?g|png|gif|bmp)$/i;

  const getTags = () => {
    getObjectTags(props.bucket, props.file.Key).then((response) => {
      setTagsLoaded(true);
      setFileTags(response);
    });
  };

  useEffect(() => {
    if (props.file.type === 'file') {
      getTags();
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
        <Card.Header>{props.file.filename}</Card.Header>
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
        tagInfo={{
          tagsLoaded: tagsLoaded,
          fileTags: fileTags,
          setFileTags: setFileTags
        }}
        file={{
          ...props.file,
          src: src
        }}
      />
    )
  ];
};
export default File;
