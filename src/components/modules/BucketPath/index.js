import React, { useState, useEffect } from 'react';
import {
  Breadcrumb,
  BreadcrumbDivider,
  BreadcrumbSection,
  Segment,
  Input,
  Dropdown
} from 'semantic-ui-react';
import './bucket-path.scss';

/**
 * This component controls the flow of the app and keeps track of where we are within the S3 bucket.
 */
const BucketPath = (props) => {
  const [schemaInfo, setSchemaInfo] = useState(props.schemaInfo);
  const [dropdownValue, setDropdownValue] = useState('');

  useEffect(() => {
    if (props.schemaInfo !== schemaInfo) {
      setDropdownValue('');
      setSchemaInfo(props.schemaInfo);
    }
  }, [props.schemaInfo, schemaInfo]);

  const changePath = (event, attributes) => {
    let newPathInfo =
      attributes.depth === 0
        ? {
            path: '',
            depth: 0
          }
        : {
            path: `${props.pathInfo.path
              .split('/', attributes.depth)
              .join('/')}/`,
            depth: attributes.depth
          };
    props.pathChange(newPathInfo);
  };

  const handleFieldChange = (event, { value }) => {
    props.search.setSearchText(value);
  };
  const handleTagChange = (event, { value }) => {
    props.search.setChosenTag(value);
    setDropdownValue(value);
  };

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
          {props.pathInfo.path
            .split('/')
            .reduce((acc, prev, index, array) => {
              if (index !== array.length - 1 || index === 0) acc.push('/');
              if (prev !== '') acc.push(prev);
              return acc;
            }, [])
            .map((file, index) => {
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
      <Input
        label={
          schemaInfo.available ? (
            <Dropdown
              options={schemaInfo.tagset.map((tag) => ({
                text: tag.key,
                value: tag.key
              }))}
              onChange={handleTagChange}
              selectOnBlur={false}
              value={dropdownValue}
              placeholder="Filename"
              clearable
            />
          ) : (
            'Filename'
          )
        }
        value={props.search.text}
        labelPosition="right"
        onChange={handleFieldChange}
        placeholder="Tag Search"
      />
    </div>
  );
};
export default BucketPath;
