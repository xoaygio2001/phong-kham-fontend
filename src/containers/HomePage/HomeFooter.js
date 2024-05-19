import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick';


class About extends Component {

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    render() {
        return (
            <div className="home-footer">
                <p>Copyright © 2023 - 2024 Juri Booking</p>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
