import React, { Component } from 'react'
import { Radio, Button } from 'semantic-ui-react'
import FileUploadModal from '../modals/FileUploadModal'

/**
 * This component controls how much info you want to load in from the api
 */
export class BucketSettings extends Component {
    constructor(props) {
        super(props)
        this.state = this.props.settings
        this.changeSetting = this.changeSetting.bind(this)
        this.batch = this.batch.bind(this)
    }

    batch() {
        let S3control = require('aws-sdk/clients/s3control');
        let AWS = require('aws-sdk')
        console.log((async function () {
            try {

                AWS.config.setPromisesDependency();
                AWS.config.update({
                    accessKeyId: process.env.REACT_APP_AWS_ACCESSKEYID,
                    secretAccessKey: process.env.REACT_APP_AWS_SECRETACCESSKEY,
                    region: process.env.REACT_APP_AWS_REGION,
                });
                let s3control = new S3control({
                    accessKeyId: process.env.REACT_APP_AWS_ACCESSKEYID,
                    secretAccessKey: process.env.REACT_APP_AWS_SECRETACCESSKEY,
                    region: process.env.REACT_APP_AWS_REGION,
                })
                var params = {
                    AccountId: '081004888135', /* required */
                    Manifest: { /* required */
                        Location: { /* required */
                            ETag: '1cfc2a77fcda3db198a19f65a53cc8b4', /* required */
                            ObjectArn: 'arn:aws:s3:::catalanobucket', /* required */
                        },
                        Spec: { /* required */
                            Format: 'S3BatchOperations_CSV_20180820',
                            Fields: [
                                'Bucket', 'Key'
                            ]
                        }
                    },
                    Operation: { /* required */
                        LambdaInvoke: {
                            // FunctionArn: 'arn:aws:lambda:us-east-1:081004888135:function:testFunc'
                            FunctionArn: 'arn:aws:lambda:us-east-1:081004888135:function:testFunc:$LATEST'
                        }
                    },
                    Priority: 10,
                    Report: { /* required */
                        Enabled: true, /* required */
                        Bucket: 'catalanobucket',
                        Format: 'Report_CSV_20180820',
                        ReportScope: 'AllTasks'
                    },
                    RoleArn: 'arn:aws:iam::081004888135:role/BatchRole', /* required */
                    ConfirmationRequired: false,
                    Description: 'This is the batch from the code',
                };
                s3control.createJob(params, function (err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else console.log(data);           // successful response
                });

            } catch (e) {
                console.log("My error", e);
            }
        })())
    }

    changeSetting(setting) {
        this.setState({
            [setting]: !this.state[setting]
        },
            () => this.props.settingsChange(this.state));

    }
    render() {
        return (
            <div className="bucket-bar">
                <span className="bucket-settings">
                    <span><Radio toggle name="loadTags" checked={this.state.loadTags} label="Load Tags" onChange={() => this.changeSetting('loadTags')} /></span>
                    <span><Radio toggle name="loadImages" checked={this.state.loadImages} label="Load Images" onChange={() => this.changeSetting('loadImages')} /></span>
                    <span><Radio toggle name="loadMetadata" checked={this.state.loadMetadata} label="Load Versions" onChange={() => this.changeSetting('loadMetadata')} /></span>
                </span>
                <span className='bucket-buttons'>
                    <Button size='medium' onClick={this.batch} >Batch</Button>
                    <FileUploadModal trigger={<Button size='medium' >Upload</Button>} />
                </span>
            </div>
        )
    }
}

export default BucketSettings
