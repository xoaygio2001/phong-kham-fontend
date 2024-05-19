import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick';
import { getAllClinic, getSuggestClinicByRegion } from '../../../services/userService';
import { withRouter } from 'react-router';
import './SuggestClinic.scss';


class SuggestClinic extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataClinic: [],
            region: ''
        }
    }

    async componentDidMount() {
        let region = ''
        fetch(`https://api.ipify.org?format=json`)
            .then((response) => response.json())
            .then((ip) => {
                fetch(`http://ipinfo.io/${ip.ip}?token=d7ede721f85e12`)
                    .then((res) => res.json())
                    .then( async(data) => {
                        region = data.region.toUpperCase()
                        let res = await getSuggestClinicByRegion(1, region);
                        // let res = await getAllClinic();
                        if (res && res.errCode === 0) {
                            this.setState({
                                dataClinic: res.data ? res.data : []
                            })
                        }
                        this.setState({
                            region: data.region
                        })
                    })
            })


    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    render() {
        console.log(this.state)
        let { dataClinic } = this.state;

        return (
            <>clinic</>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SuggestClinic));
