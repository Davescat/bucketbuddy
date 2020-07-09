import React, { Component } from "react";
import { Card, Image, Placeholder } from "semantic-ui-react";
import { S3 } from "aws-sdk";

export class File extends Component {
  constructor() {
    super();
    this.state = {
      imageLoaded: false,
      src: "",
    };
    this.getData = this.getData.bind(this);
    this.encode = this.encode.bind(this);
    this.handleFileClick = this.handleFileClick.bind(this);
  }

  getData() {
    var AWS = require("aws-sdk");
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

  componentDidMount() {
    if (this.props.file.type === "file") {
      this.getData().then((data) => {
        this.setState({
          imageLoaded: true,
          src: `data:image/jpg;base64, ${this.encode(data)}`,
        });
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.file.Key !== this.props.file.Key) {
      if (this.props.file.type === "file") {
        this.getData().then((data) => {
          this.setState({
            imageLoaded: true,
            src: `data:image/jpg;base64, ${this.encode(data.Body)}`,
          });
        });
      }
    }
  }

  /**
   * Gets the appropriate tags for whatever type of file requested
   */
  getImage() {
    if (this.props.settings.loadImages) {
      if (this.props.file.type === "file") {
        if (this.state.imageLoaded) {
          return <Image src={this.state.src} wrapped ui={false} />;
        } else {
          return (
            <Placeholder>
              <Placeholder.Image square />
            </Placeholder>
          );
        }
      }
    } else {
      if (this.props.file.type === "file") {
        return (
          <Image
            src="https://react.semantic-ui.com/images/wireframe/square-image.png"
            wrapped
            ui={false}
          />
        );
      }
    }
  }

  handleFileClick() {
    if (this.props.file.type == "folder") {
      let newDepth = this.props.file.Key.split("/").length - 1;
      let newPathInfo = {
        path: this.props.file.Key,
        depth: newDepth,
      };
      this.props.customClickEvent(newPathInfo);
    }
  }

  render() {
    return (
      <Card style={{ cursor: "pointer" }} onClick={this.handleFileClick}>
        {this.getImage()}
        <Card.Content>
          <Card.Header>{this.props.file.Key}</Card.Header>
          <Card.Meta>{`Last modified: ${this.props.file.LastModified}`}</Card.Meta>
          <Card.Meta>{`Size: ${this.props.file.Size} bytes`}</Card.Meta>
        </Card.Content>
      </Card>
    );
  }
}

/*

listObjectv2
    ETag: "\"70ee1738b6b21e2c8a43f3a5ab0eee71\"", 
    Key: "happyface.jpg", 
    LastModified: <Date Representation>, 
    Size: 11, 
    StorageClass: "STANDARD"
getObject
    AcceptRanges: "bytes", 
    ContentLength: 10, 
    ContentRange: "bytes 0-9/43", 
    ContentType: "text/plain", 
    ETag: "\"0d94420ffd0bc68cd3d152506b97a9cc\"", 
    LastModified: <Date Representation>, 
    Metadata: {
    }, 
    VersionId: "null"
    
*/
export default File;
