import React, { useState, useEffect } from 'react';
import { Input, List, Modal, Segment, Transition } from 'semantic-ui-react';
import { listAllObjects } from '../../utils/amazon-s3-utils';
import Fuse from 'fuse.js';
import './search-module.scss';

const SearchModule = (props) => {
  const [modalOpen, setModalOpen] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [allFiles, setAllFiles] = useState(null);
  const [fuse, setFuse] = useState(null);
  const [results, setResults] = useState([]);
  const { log } = console;

  useEffect(() => {
    // listAllObjects(props.bucket, '').then(setAllFiles)
  }, []);

  const onOpen = () => {
    setModalOpen(true);
    listAllObjects(props.bucket, '').then((list) => {
      log(list);
      setFuse(
        new Fuse(
          list.map((file) => ({
            key: file.Key,
            date: file.LastModified.toISOString()
          })),
          { includeScore: true, keys: ['key'] }
        )
      );
      setAllFiles(list);
    });
  };

  const handleChange = (event, { value }) => {
    console.log(value);
    if (allFiles && fuse) {
      setResults(fuse.search(value));
    }
  };
  return (
    <Modal
      onOpen={onOpen}
      onClose={() => setModalOpen(false)}
      open={modalOpen}
      trigger={props.trigger}
      closeIcon
    >
      <Modal.Content>
        <Segment>
          <Input
            fluid
            icon={'search'}
            onChange={handleChange}
            loading={allFiles == null}
            disabled={!fuse}
            placeholder="Search..."
          />
          <div className="search-results">
            <div>
              <Transition.Group
                as={List}
                duration={200}
                divided
                size="huge"
                verticalAlign="middle"
              >
                {results.map(({ item: file }) => (
                  <List.Item>
                    {/* <List.Icon name='github' size='medium' verticalAlign='middle' /> */}
                    <List.Content>
                      <List.Header as="a">{file.key}</List.Header>
                      <List.Description as="a">{file.date}</List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </Transition.Group>
            </div>
          </div>
        </Segment>
      </Modal.Content>
    </Modal>
  );
};
export default SearchModule;
{
  /* <List.Item>
                                <List.Icon name='github' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header as='a'>Semantic-Org/Semantic-UI</List.Header>
                                    <List.Description as='a'>Updated 10 mins ago</List.Description>
                                </List.Content>
                            </List.Item> */
}
