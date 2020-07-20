import React, { Component } from 'react'
import { Card, Image, Placeholder } from 'semantic-ui-react'
import { S3 } from 'aws-sdk'

export class File extends Component {
    constructor() {
        super()
        this.state = {
            imageLoaded: false,
            src: ""
        }
        this.getData = this.getData.bind(this)
        this.encode = this.encode.bind(this)
        this.handleFileClick = this.handleFileClick.bind(this)

    }



    getData() {
        var AWS = require('aws-sdk');
        return (async function (key) {
            try {
                AWS.config.setPromisesDependency();
                AWS.config.update({
                    accessKeyId: process.env.REACT_APP_AWS_ACCESSKEYID,
                    secretAccessKey: process.env.REACT_APP_AWS_SECRETACCESSKEY,
                    region: process.env.REACT_APP_AWS_REGION,
                });
                const s3 = new AWS.S3();
                const res = await s3
                    .getObject({
                        Bucket: process.env.REACT_APP_AWS_BUCKET,
                        Key: key,
                    })
                    .promise()
                    .then((response) => {
                        return response;
                    });

                return res;
            } catch (e) {
                console.log("My error", e);
            }
        })(this.props.file.Key);
    }

    /**
     * Turns the UInt8Aray into a base64 encoded string as the source for the displayable image
     * @param {S3.GetObjectOutput} data 
     */
    encode(data) {
        var str = data.Body.reduce(function (a, b) {
            return a + String.fromCharCode(b);
        }, "");
        return btoa(str).replace(/.{76}(?=.)/g, "$&\n");
    }

    getImageUrl() {
        var AWS = require('aws-sdk');
        return (async function (key) {
            try {
                AWS.config.setPromisesDependency();
                AWS.config.update({
                    accessKeyId: process.env.REACT_APP_AWS_ACCESSKEYID,
                    secretAccessKey: process.env.REACT_APP_AWS_SECRETACCESSKEY,
                    region: process.env.REACT_APP_AWS_REGION,
                });
                const s3 = new AWS.S3();
                const url = await s3.getSignedUrlPromise('getObject', { Bucket: process.env.REACT_APP_AWS_BUCKET, Key: key });
                return url
            } catch (e) {
                console.log("My error", e);
            }
        })(this.props.file.Key);
    }


    componentDidMount() {
        if (this.props.file.type === 'file') {
            this.getImageUrl().then(data => {
                this.setState({
                    imageLoaded: true,
                    src: data
                })
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.file.Key !== this.props.file.Key) {
            this.getImageUrl().then(data => {
                this.setState({
                    imageLoaded: true,
                    src: data
                })
            })
        }

    }

    /**
     * Gets the appropriate tags for whatever type of file requested
     */
    getImage() {
        if (this.props.settings.loadImages) {
            if (this.props.file.type === 'file') {
                if (this.state.imageLoaded) {
                    return <Image src={this.state.src} />
                } else {
                    return (<Placeholder>
                        <Placeholder.Image square />
                    </Placeholder>)
                }
            }
        } else {
            if (this.props.file.type === 'file') {
                return <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' wrapped ui={false} />
            }
        }
    }

    handleFileClick() {
        if (this.props.file.type == 'folder') {
            let newDepth = this.props.file.Key.split('/').length - 1
            let newPathInfo = {
                path: this.props.file.Key,
                depth: newDepth
            }
            this.props.customClickEvent(newPathInfo)
        }
    }

    render() {
        let keys = this.props.file.Key.split('/')
        let filename = ''
        if (this.props.file.type === 'file') {
            filename = (keys.length === 1) ? keys[0] : keys[keys.length - 1]
        } else {
            filename = (keys.length === 1) ? keys[0] : keys[keys.length - 2] + '/'
        }
        return (
            <Card style={{ cursor: 'pointer' }} onClick={this.handleFileClick}>
                {this.getImage()}
                <Card.Content >
                    <Card.Header>{filename}</Card.Header>
                    <Card.Meta>{`Last modified: ${this.props.file.LastModified}`}</Card.Meta>
                    <Card.Meta>{`Size: ${this.props.file.Size} bytes`}</Card.Meta>

                </Card.Content>
            </Card>
        )
    }
}
export default File
