import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Specialty.scss';
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllSpecialty, getOutstandingSpecialties } from '../../../services/userService';
import { withRouter } from 'react-router';


class Specialty extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSpecialty: []
        }
    }

    async componentDidMount() {
        // let res = await getAllSpecialty();
        let res = await getOutstandingSpecialties(8);
        

        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            })
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`)
        }
    }

    handleGoToSpecialty = () => {
        if (this.props.history) {
            this.props.history.push(`/specialty`)
        }
    }


    render() {

        let { dataSpecialty } = this.state;
        return (
<>chuyen khoa</>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
