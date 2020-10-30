import { Organizations } from 'aws-sdk';
import React, { useState } from 'react';
import { Card } from 'semantic-ui-react';
import FileDetailsModal from '../../modals/file-details-modal';
import useWindowDimensions from '../../utils/window-utils';
import File from '../File';
import './filecontainer.scss';

const FileContainer = (props) => {
  const { bucket, files } = props;
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
  const openModal = (file) => {
    setModalFile(file);
    setModalOpen(true);
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
    <Card.Group itemsPerRow={items()} className="file-container" doubling>
      {files &&
        files.length > 0 &&
        files.map((x, i) => (
          <File
            bucket={bucket}
            openModal={openModal}
            key={`${i}${x.filename}`}
            file={x}
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
