import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Divider,
  Form,
  Header,
  Image,
  Message,
  Segment
} from "semantic-ui-react";


export class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleServerProtocolChange = this.handleServerProtocolChange.bind(
      this
    );
  }

  state = {
    username: "alice",
    password: "alice123",
    serverAddress: "localhost:8000",
    serverProtocol: "http://"
  };
  componentDidMount() {
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleServerProtocolChange = (e, { name, value }) =>
    this.setState({ serverProtocol: value });

  onSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.state.serverAddress, this.state.username.toLowerCase(), this.state.password);
  }

  render() {

    const { serverAddress, username, password } = this.state;

    const timeNow = new Date().toLocaleTimeString();

    return (
      <div
        style={{
          paddingTop: 150,
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          overflowY: "auto",
          backgroundColor: "#dddddd",
          backgroundSize: "cover"
        }}
      >
        <div style={{ maxWidth: 500, padding: 20, margin: "0 auto" }}>
          <Header as="h3" textAlign="center">
            <Image src={"/logo.png"} />
            <Header.Content>Lomorage </Header.Content>
          </Header>
          <Segment attached>
            <Header>Login</Header>

            <Form onSubmit={this.onSubmit}>
              <Form.Field>
                <label>Lomod Server Address</label>
                <Form.Input
                  icon="server"
                  placeholder="ServerAddress"
                  name="serverAddress"
                  value={serverAddress}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <label>User Name</label>
                <Form.Input
                  icon="user"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <Form.Input
                  icon="lock"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                />
                <Divider />
                <Form.Button fluid color="blue" content="Log in" />
              </Form.Field>
            </Form>
          </Segment>
          {this.props.errors &&
            this.props.errors.data &&
              this.props.errors.data.detail && (
              <Message color="red" secondary attached>
                <p>
                  {this.props.errors.data.detail}
                </p>
                <p>
                  {timeNow}
                </p>
              </Message>
            )
          }
          {this.props.errors &&
            this.props.errors.data &&
            !this.props.errors.data.detail && (
              <Message color="red" secondary attached>
                <p>
                  No connection to backend server, try again in a few minutes.
                </p>
                <p>
                  {timeNow}
                </p>
              </Message>
            )
          }
          {this.props.errors &&
            this.props.errors.password && (
              <Message color="red" secondary attached>
                <p>
                Password may not be blank!
                </p>
                <p>
                  {timeNow}
                </p>
              </Message>
            )
          }
          {this.props.errors &&
            this.props.errors.username && (
              <Message color="red" secondary attached="bottom">
                <p>
                Username may not be blank!
                </p>
                <p>
                  {timeNow}
                </p>
              </Message>
            )
          }
        </div>
        <div
          style={{
            maxWidth: 400,
            textAlign: "center",
            paddingTop: "10%",
            margin: "0 auto"
          }}
        >
          A comfy place for your photos.
        </div>
      </div>
    );
  }
}
