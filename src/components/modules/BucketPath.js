import React from 'react';
import {
  Breadcrumb,
  BreadcrumbDivider,
  BreadcrumbSection,
  Button,
  Segment
} from 'semantic-ui-react';

import { deleteObject } from '../utils/amazon-s3-utils';

const BucketPath = (props) => {
  const deleteCurrentFolder = () => {
    if (props.pathInfo.depth >= 1) {
      let pathValues = props.pathInfo.path.split('/');

      deleteObject(props.bucket, props.pathInfo.path);

      pathValues.pop();
      pathValues.pop();

      const newPath = pathValues.join('/');

      changePath(null, { path: newPath, depth: pathValues.length });
      props.updateList();
    }
  };

  const changePath = (event, attributes) => {
    let newPathInfo =
      attributes.depth === 0
        ? {
            path: '',
            depth: 0
          }
        : {
            path: `${props.pathInfo.path.split('/', attributes.depth)}/`,
            depth: attributes.depth
          };
    props.pathChange(newPathInfo);
  };

  let pathArr = props.pathInfo.path.split('/');
  let arr = ['/'];
  for (let i = 0; i < props.pathInfo.depth; i++) {
    arr.push(pathArr.shift());
    if (i !== props.pathInfo.depth - 1) arr.push('/');
  }
  return (
    <div className="bucket-path">
      <Segment basic>
        <Breadcrumb>
          Current Directory:&nbsp;
          {props.pathInfo.depth === 0 && (
            <BreadcrumbSection active>{props.bucket.name}</BreadcrumbSection>
          )}
          {props.pathInfo.depth !== 0 && (
            <BreadcrumbSection
              onClick={changePath}
              depth={0}
              active={props.pathInfo.depth === 0}
            >
              {props.bucket.name}
            </BreadcrumbSection>
          )}
          {arr.map((file, index) => {
            if (file === '/') {
              return (
                <BreadcrumbDivider key={`bread${index}`}>/</BreadcrumbDivider>
              );
            } else {
              let sectionDepth = (index + 1) / 2;
              return index !== props.pathInfo.depth * 2 - 1 ? (
                <BreadcrumbSection
                  key={`bread${index}`}
                  onClick={changePath}
                  depth={sectionDepth}
                >
                  {file}
                </BreadcrumbSection>
              ) : (
                <BreadcrumbSection
                  key={`bread${index}`}
                  depth={sectionDepth}
                  active
                >
                  {file}
                </BreadcrumbSection>
              );
            }
          })}
        </Breadcrumb>
      </Segment>
      {props.pathInfo.depth >= 1 ? (
        <Segment basic textAlign="right">
          <Button size="small" color="red" onClick={deleteCurrentFolder}>
            Delete Current Folder
          </Button>
        </Segment>
      ) : (
        ''
      )}
    </div>
  );
};
export default BucketPath;
