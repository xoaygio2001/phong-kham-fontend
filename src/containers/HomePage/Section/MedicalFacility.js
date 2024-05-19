import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick';
import { getAllClinic, getOutstandingClinic } from '../../../services/userService';
import { withRouter } from 'react-router';
import './MedicalFacility.scss';


class MedicalFacility extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataClinic: [],
            limit: 8
        }
    }

    async componentDidMount() {
        let res = await getOutstandingClinic(8);
        if (res && res.errCode === 0) {
            this.setState({
                dataClinic: res.data ? res.data : []
            })
        }
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    handleGoToClinic = () => {
        if (this.props.history) {
            this.props.history.push(`/clinic/1`)
        }
    }

    render() {
        let { dataClinic } = this.state;

        return (
            <div className='clinic-section'>
                
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
