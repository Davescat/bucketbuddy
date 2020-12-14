import React from 'react';
import {
  Breadcrumb,
  BreadcrumbDivider,
  BreadcrumbSection,
  Segment,
  Button
} from 'semantic-ui-react';
import './bucket-path.scss';

/**
 * This component controls the flow of the app and keeps track of where we are within the S3 bucket.
 */
const BucketPath = ({ pathInfo, pathChange, bucket, searchModal }) => {
  const changePath = (newDepth) => {
    pathChange(
      newDepth === 0
        ? {
            path: '',
            depth: 0
          }
        : {
            path: `${pathInfo.path.split('/', newDepth).join('/')}/`,
            depth: newDepth
          }
    );
  };

  const getCrumbs = () => {
    return (
      pathInfo.path
        .split('/')
        // reduce method converts an array like ['foo','bar','mickey'] into ['/','foo','/','bar','/''mickey']
        .reduce((acc, prev) => (prev !== '' ? acc.concat('/', prev) : acc), [])
        .map((file, index) => {
          let activeFolder = index === pathInfo.depth * 2 - 1;
          return file === '/' ? (
            <BreadcrumbDivider key={`bread${index}`}>/</BreadcrumbDivider>
          ) : (
            <BreadcrumbSection
              key={`bread${index}`}
              onClick={!activeFolder ? () => changePath((index + 1) / 2) : null}
              active={activeFolder}
              children={file}
            />
          );
        })
    );
  };

  return (
    <div className="bucket-path">
      <Segment basic>
        <Button
          circular
          basic
          icon={'search'}
          onClick={() => searchModal(true)}
          size={'small'}
        />
        <Breadcrumb size="large">
          Current Folder:&nbsp;
          <BreadcrumbSection
            onClick={pathInfo.depth !== 0 ? () => changePath(0) : null}
            active={pathInfo.depth === 0}
            children={bucket.name}
          />
          {getCrumbs()}
        </Breadcrumb>
      </Segment>
    </div>
  );
};
export default BucketPath;
