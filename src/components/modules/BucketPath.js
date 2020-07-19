import React, { Component } from 'react';
import {
  Breadcrumb,
  BreadcrumbDivider,
  BreadcrumbSection
} from 'semantic-ui-react';

export class BucketPath extends Component {
  render() {
    let pathArr = this.props.pathInfo.path.split('/');
    let arr = ['/'];
    for (let i = 0; i < this.props.pathInfo.depth; i++) {
      arr.push(pathArr.shift());
      if (i !== this.props.pathInfo.depth - 1) arr.push('/');
    }
    return (
      <div className="bucket-path">
        <Breadcrumb>
          Current Directory:
          {this.props.pathInfo.depth === 0 && (
            <BreadcrumbDivider>/</BreadcrumbDivider>
          )}
          {this.props.pathInfo.depth > 0 &&
            arr.map((file, index) => {
              if (file === '/') {
                return <BreadcrumbDivider>/</BreadcrumbDivider>;
              } else {
                return index !== this.props.pathInfo.depth * 2 - 1 ? (
                  <BreadcrumbSection>{file}</BreadcrumbSection>
                ) : (
                  <BreadcrumbSection active>{file}</BreadcrumbSection>
                );
              }
            })}
        </Breadcrumb>
      </div>
    );
  }
}

export default BucketPath;
