import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Embed, Label} from "semantic-ui-react";
import { Server } from "../api_client/apiClient";


export class SecuredImageJWT extends Component {


  render() {
    console.log(this.props)
    if (this.props.extension === "mp4" || this.props.extension === "mov" 
        || this.props.extension === "webm" || this.props.extension === "3gp") {
      return (
        <Embed
          icon='right circle play'
          placeholder={this.props.src} url={this.props.src}
          onClick={this.props.onClick}
        />
      );
    } else if (this.props.extension === "zip") {
      return (
        <Image
          {...this.props}
        >
        </Image>
      );
    } else {
      return (
        <Image
          {...this.props}
        />
      );
    }
  }
}

export class SecuredImage extends Component {
  state = {
    imgData: null
  };

  componentWillMount() {
    console.log(this.props.src);
    Server.get(this.props.src)
      .then(resp => {
        console.log("success");
        this.setState({ imgData: resp.data.data });
      })
      .catch(err => {
        console.log("fail");
      });
  }
  render() {
    const { imgData } = this.state;
    var newProps = this.props;
    delete newProps.dispatch;
    if (imgData) {
      return <Image {...newProps} src={"data:image/jpeg;base64," + imgData} />;
    }
    return <Image {...newProps} src={"/thumbnail_placeholder.png"} />;
  }
}

SecuredImageJWT = connect(store => {
  return {
    auth: store.auth
  };
})(SecuredImageJWT);

