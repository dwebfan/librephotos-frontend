import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LoginPage } from "../layouts/login/LoginPage";
import { login } from "../actions/authActions";
import { fetchSiteSettings } from "../actions/utilActions";
import { authErrors, isRefreshTokenExpired } from "../reducers";

const Login = (props) => {
  if (props.isAuthenticated) {
    if (props.location.state) {
      return <Redirect to={props.location.state.from.pathname} />;
    } else {
      return <Redirect to="/" />;
    }
  } else {
    return (
      <div className="login-page">
        <LoginPage {...props} />
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  siteSettings: state.util.siteSettings,
  isAuthenticated: !isRefreshTokenExpired(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (serverAddress, username, password) => {
    dispatch(login(serverAddress, username, password))
  },
  fetchSiteSettings: () => {
    dispatch(fetchSiteSettings());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
