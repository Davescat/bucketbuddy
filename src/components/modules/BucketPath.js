import React from 'react';
import {
  Breadcrumb,
  BreadcrumbDivider,
  BreadcrumbSection
} from 'semantic-ui-react';
import { deleteObject } from '../utils/amazon-s3-utils';

const BucketPath = (props) => {
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
    </div>
  );
};
export default BucketPath;
