import React, { Component } from 'react'
import { Breadcrumb, BreadcrumbDivider, BreadcrumbSection } from 'semantic-ui-react'

class BucketPath extends Component {
    constructor() {
        super()
        this.state = {}
        this.changePath = this.changePath.bind(this)
    }

    changePath(event, attributes) {
        let newPathInfo = attributes.depth === 0 ?
            {
                path: '',
                depth: 0
            } :
            {
                path: `${this.props.pathInfo.path.split('/', attributes.depth)}/`,
                depth: attributes.depth
            }
        this.props.pathChange(newPathInfo)
    }

    render() {
        let pathArr = this.props.pathInfo.path.split('/')
        let arr = ["/"]
        for (let i = 0; i < this.props.pathInfo.depth; i++) {
            arr.push(pathArr.shift())
            if (i !== this.props.pathInfo.depth - 1) arr.push('/')
        }
        return (
            <div className='bucket-path'>
                <Breadcrumb >Current Directory:&nbsp;
                {this.props.pathInfo.depth === 0 && <BreadcrumbSection active>{process.env.REACT_APP_AWS_BUCKET}</BreadcrumbSection>}
                    {this.props.pathInfo.depth !== 0 && <BreadcrumbSection href='#' onClick={this.changePath} depth={0} active={this.props.pathInfo.depth === 0} >{process.env.REACT_APP_AWS_BUCKET}</BreadcrumbSection>}
                    {arr.map((file, index) => {
                        if (file === '/') {
                            return <BreadcrumbDivider>/</BreadcrumbDivider>
                        } else {
                            let sectionDepth = (index + 1) / 2
                            return index !== (this.props.pathInfo.depth * 2) - 1 ?
                                <BreadcrumbSection onClick={this.changePath} href='#' depth={sectionDepth}>{file}</BreadcrumbSection> :
                                <BreadcrumbSection depth={sectionDepth} active>{file}</BreadcrumbSection>
                        }
                    })}
                </Breadcrumb>
            </div>
        )
    }
}

export default BucketPath
