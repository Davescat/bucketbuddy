import React, { Component } from 'react'
import File from "./File"
import { Card } from 'semantic-ui-react';

export class FileContainer extends Component {
    constructor() {
        super()
        this.state = {
            folders: [],
            files: []
        }
        this.listObjects = this.listObjects.bind(this)

    }
    listObjects() {
        var AWS = require('aws-sdk');
        return (async function (path) {
            try {
                console.log(path);

                AWS.config.setPromisesDependency();
                AWS.config.update({
                    accessKeyId: process.env.REACT_APP_AWS_ACCESSKEYID,
                    secretAccessKey: process.env.REACT_APP_AWS_SECRETACCESSKEY,
                    region: process.env.REACT_APP_AWS_REGION,
                });
                const s3 = new AWS.S3();
                const res = await s3
                    .listObjectsV2({
                        Bucket: process.env.REACT_APP_AWS_BUCKET,
                        Prefix: path
                    })
                    .promise()
                    .then((response) => {
                        return response
                    });
                return res;
            } catch (e) {
                console.log("My error", e);
            }
        })(this.props.pathInfo.path)
    }

    componentDidMount() {
        this.listObjects().then(response => {
            console.log(response);
            let depth = this.props.pathInfo.depth +1
            let newFolders = response.Contents.filter(x => x.Key.split('/').length === depth + 1 && x.Key[x.Key.length - 1] === '/').map(folder => { folder.type = 'folder'; return folder })
            let newFiles = response.Contents.filter(x => x.Key.split('/').length === depth && x.Key[x.Key.length - 1] !== '/').map(file => { file.type = 'file'; return file })
            this.setState({
                folders: newFolders,
                files: newFiles
            })
        });

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.pathInfo.path !== this.props.pathInfo.path) {
            this.listObjects().then(response => {
                console.log(response);
                let depth = this.props.pathInfo.depth +1
                let newFolders = response.Contents.filter(x => x.Key.split('/').length === depth + 1 && x.Key[x.Key.length - 1] === '/').map(folder => { folder.type = 'folder'; return folder })
                let newFiles = response.Contents.filter(x => x.Key.split('/').length === depth && x.Key[x.Key.length - 1] !== '/').map(file => { file.type = 'file'; return file })
                this.setState({
                    folders: newFolders,
                    files: newFiles
                })
            });
        }

    }
    render() {
        let displayFiles = this.state.folders.concat(this.state.files);
        return (
            <Card.Group className="file-container">
                {displayFiles.map((x, i) => <File key={`file${i}`} file={x} settings={this.props.settings} customClickEvent={this.props.pathChange} />)}
            </Card.Group>
        )
    }
}
/*
  data = {
   Contents: [
      {
     ETag: "\"70ee1738b6b21e2c8a43f3a5ab0eee71\"", 
     Key: "happyface.jpg", 
     LastModified: <Date Representation>, 
     Size: 11, 
     StorageClass: "STANDARD"
    }, 
      {
     ETag: "\"becf17f89c30367a9a44495d62ed521a-1\"", 
     Key: "test.jpg", 
     LastModified: <Date Representation>, 
     Size: 4192256, 
     StorageClass: "STANDARD"
    }
   ], 
   IsTruncated: true, 
   KeyCount: 2, 
   MaxKeys: 2, 
   Name: "examplebucket", 
   NextContinuationToken: "1w41l63U0xa8q7smH50vCxyTQqdxo69O3EmK28Bi5PcROI4wI/EyIJg==", 
   Prefix: ""
  }
  */
export default FileContainer
