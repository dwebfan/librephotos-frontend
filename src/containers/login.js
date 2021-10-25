import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { LoginPage } from '../layouts/loginPage'
import { login } from  '../actions/authActions'
import { fetchSystemInfo } from '../actions/utilActions'
import { authErrors, isRefreshTokenExpired } from '../reducers'


const Login = (props) => {
  console.log(props)
  if(props.isAuthenticated) {
    console.log("authenticated: " + props)
    if (props.location.state) {
      return (
        <Redirect to={props.location.state.from.pathname} />
      )
    } else {
      return (
        <Redirect to='/' />
      )
    }
  } else {
    console.log("start authenticate: " + props)
    return (
      <div className="login-page">
        <LoginPage {...props}/>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  systemInfo: state.util.systemInfo,
  isAuthenticated: !isRefreshTokenExpired(state),
})

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (serverAddress, username, password) => {
    dispatch(login(serverAddress, username, password))
  },
  fetchSystemInfo: () => {
    dispatch(fetchSystemInfo())
  }

})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
