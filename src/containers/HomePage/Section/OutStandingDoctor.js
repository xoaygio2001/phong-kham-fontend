import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';
import { getOutstandingDoctors } from '../../../services/userService'
import './OutStandingDoctor.scss';


class OutStandingDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: [],
            arrOutstandingDoctors: [],
            limit: 8
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }

    }

    async componentDidMount() {
        this.props.loadTopDoctors();
        await this.setDataDoctor();

    }

    setDataDoctor = async () => {
        const res = await getOutstandingDoctors(8)
        if(res && res.errCode == 0) {
            this.setState({
                arrOutstandingDoctors: res.data
            })
        }

    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }

    }

    handleGoToDoctor = () => {
        if (this.props.history) {
            this.props.history.push(`/all-doctor/1`)
        }
    }

    render() {
        let arrDoctors = this.state.arrDoctors;
        let { language } = this.props;
        let { arrOutstandingDoctors } = this.state

        return (
            <>outstanding doctor</>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
