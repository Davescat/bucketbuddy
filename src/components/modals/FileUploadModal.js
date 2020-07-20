import React, { Component } from 'react'
import { Button, Modal, Form } from 'semantic-ui-react'

export class FileUploadModal extends Component {
    render() {
        return (
            <Modal trigger={this.props.trigger}>
                <Modal.Header>Select an Image to Uploads</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input type="file"/>
                        <Button type='submit'>Upload</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}

export default FileUploadModal
