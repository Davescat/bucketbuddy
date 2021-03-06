import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'semantic-ui-react';
import FileDetailsModal from '../FileDetailsModule';
import useWindowDimensions from '../../utils/window-utils';
import File from '../File';
import './file-container.scss';

const FileContainer = (props) => {
  const { bucket, files, pathInfo } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const { width } = useWindowDimensions();
  const breakpoints = {
    mobile: 320,
    tablet: 768,
    computer: 992,
    largeScreen: 1200,
    largerScreen: 1560,
    widescreen: 1920
  };

  const unmounted = useRef(false);
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const openModal = (file) => {
    if (!unmounted.current) {
      setModalFile(file);
      setModalOpen(true);
    }
  };

  const items = () => {
    if (width > 0 && width <= breakpoints.mobile) return 3;
    else if (width > breakpoints.mobile && width <= breakpoints.tablet)
      return 4;
    else if (width > breakpoints.tablet && width <= breakpoints.computer)
      return 4;
    else if (width > breakpoints.computer && width <= breakpoints.largeScreen)
      return 4;
    else if (
      width > breakpoints.largeScreen &&
      width <= breakpoints.largerScreen
    )
      return 5;
    else if (
      width > breakpoints.largerScreen &&
      width <= breakpoints.widescreen
    )
      return 7;
    else return 9;
  };

  return [
    <Card.Group
      itemsPerRow={items()}
      className="file-container"
      doubling
      key={1}
    >
      {files &&
        files.length > 0 &&
        files.map((file, i) => (
          <File
            bucket={bucket}
            openModal={openModal}
            key={`${i}${file.filename}`}
            file={file}
            updateSrcArray={props.updateSrcArray}
            updateTagState={props.updateTagState}
            schemaInfo={props.schemaInfo}
            updateList={props.updateList}
            settings={props.settings}
            customClickEvent={props.pathChange}
          />
        ))}
    </Card.Group>,
    files && files.length > 0 && (
      <FileDetailsModal
        key={2}
        pathInfo={pathInfo}
        updateList={props.updateList}
        bucket={bucket}
        modalOpen={modalOpen}
        schemaInfo={props.schemaInfo}
        handleClose={() => setModalOpen(false)}
        updateTagState={props.updateTagState}
        file={modalFile}
      />
    )
  ];
};
export default FileContainer;
