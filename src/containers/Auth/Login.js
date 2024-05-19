import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLogin } from '../../services/userService';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: ''
        }

    }

    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('persist:user'));
        console.log('userData: ', userData);

        if (userData.isLoggedIn == 'false') {
            console.log('cc')
            this.props.history.push(`/home`)
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        });
    }


    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        });
    }

    handlingShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        });
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let data = await handleLogin(this.state.username, this.state.password);
            if (data && data.errCode != 0) {
                this.setState({
                    errMessage: data.message
                });
            }
            if (data && data.errCode == 0) {
                this.props.userLoginSuccess(data.user);
            }
        }
        catch (except) {
            if (except.response) {
                if (except.response.data) {
                    this.setState({
                        errMessage: except.response.data.message
                    })
                }
            }
        }



    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleLogin();
        }
    }

    render() {

        const userData = JSON.parse(localStorage.getItem('persist:user'));

        if (userData.isLoggedIn == 'false') {
            console.log('cc')
            this.props.history.push(`/home`)
        }

        return (
            <></>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.adminLoginFail()),

        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
