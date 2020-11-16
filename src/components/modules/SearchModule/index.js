import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Icon,
  Input,
  List,
  Modal,
  Segment,
  Transition
} from 'semantic-ui-react';
import { listAllObjects } from '../../utils/amazon-s3-utils';
import Fuse from 'fuse.js';
import './search-module.scss';

const SearchModule = ({
  bucket,
  pathChange,
  modalControl: { searchModalOpen, setSearchModalOpen },
  trigger
}) => {
  const input = useRef(null);
  const [searchInput, setSearchInput] = useState({ text: '', loading: false });
  const [allFiles, setAllFiles] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [fuse, setFuse] = useState(
    new Fuse([], { includeScore: true, keys: ['key'] })
  );
  const [results, setResults] = useState([]);
  const icon = useRef(null);

  useEffect(() => {
    if (searchModalOpen && searchInput.loading) {
      const delayDebounceFn = setTimeout(() => {
        if (allFiles && fuse) {
          if (searchInput.text === '') {
            setResults([]);
            setSearchInput({ ...searchInput, loading: false });
          } else {
            setResults(fuse.search(searchInput.text));
            setSearchInput({ ...searchInput, loading: false });
          }
        }
      }, 750);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchModalOpen, searchInput, allFiles, fuse]);

  useEffect(() => {
    const imageTest = /\.(jpe?g|png|gif|bmp|tif?f|raw|webp)$/i;
    const giveIcon = (key) => {
      if (imageTest.exec(key)) {
        return 'file image';
      } else if (key[key.length - 1] === '/') {
        return 'folder';
      } else {
        return 'file';
      }
    };
    if (searchModalOpen && bucket && isRefreshing) {
      listAllObjects(bucket, '').then((list) => {
        setIsRefreshing(false);
        setFuse(
          new Fuse(
            list.map((file) => ({
              key: file.Key,
              date: file.LastModified.toDateString(),
              type: giveIcon(file.Key)
            }))
          )
        );
        setAllFiles(list);
        if (input) {
          input.current.focus();
        }
      });
    } else {
      if (!searchModalOpen) {
        setSearchInput({ text: '', loading: false });
        setResults([]);
      }
    }
  }, [searchModalOpen, bucket, isRefreshing]);

  const goToFile = ({ key }) => {
    const deets = key.split('/');
    const newPath = {
      path:
        key[key.length - 1] === '/'
          ? key
          : `${deets.slice(0, deets.length - 1).join('/')}${
              deets.length === 1 ? '' : '/'
            }`,
      depth: deets.length - 1
    };
    setSearchModalOpen(false);
    pathChange(newPath);
  };

  return (
    <Modal
      centered={false}
      className="search-modal"
      onOpen={() => setSearchModalOpen(true)}
      onClose={() => setSearchModalOpen(false)}
      open={searchModalOpen}
      trigger={trigger}
      closeIcon
    >
      <Modal.Content>
        <Segment>
          <div className="search-input">
            <Button
              circular
              size={'small'}
              basic
              icon={
                <Icon
                  ref={icon}
                  name="refresh"
                  onClick={() => setIsRefreshing(true)}
                />
              }
            />
            <Input
              fluid
              ref={input}
              icon={'search'}
              value={searchInput.text}
              onChange={(event, { value }) =>
                setSearchInput({ text: value, loading: true })
              }
              loading={allFiles == null}
              disabled={!fuse}
              placeholder="Search..."
            />
          </div>
          <div className="search-results">
            <Segment
              basic
              loading={searchInput.loading || isRefreshing}
              className="results"
            >
              <Transition.Group
                as={List}
                duration={200}
                divided
                size="huge"
                verticalAlign="middle"
              >
                {results.map(({ item: file }) => (
                  <List.Item key={file.key} onClick={() => goToFile(file)}>
                    <List.Icon name={file.type} verticalAlign="middle" />
                    <List.Content>
                      <List.Header>{file.key}</List.Header>
                      <List.Description as="a">
                        Last modified: {file.date}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </Transition.Group>
            </Segment>
          </div>
        </Segment>
      </Modal.Content>
    </Modal>
  );
};
export default SearchModule;
