import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';
import './SuggestClinic.scss';


class SuggestClinic extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataClinic: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinic: res.data ? res.data : []
            })
        }
        fetch(`https://api.ipify.org?format=json`)
            .then((response) => response.json())
            .then((ip) => {
                fetch(`http://ipinfo.io/${ip.ip}?token=d7ede721f85e12`)
                    .then((res) => res.json())
                    .then((data) => {
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
            <div className="section-share section-remote-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                        <FormattedMessage id="homepage.suggest-clinic" />
                        </span>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {dataClinic && dataClinic.length > 0 &&
                                dataClinic.map((item, index) => {
                                    return (
                                        <div className='section-customize clinic-child'
                                            key={index}
                                            onClick={() => this.handleViewDetailClinic(item)}

                                        >
                                            <div className='bg-image section-medical-facility '
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />

                                            <div className='clinic-name'>{item.name}</div>
                                            <div className='clinic-province'>{item.provinceTypeData.valueVi}</div>
                                        </div>
                                    )
                                })
                            }

                        </Slider>
                    </div>
                </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SuggestClinic));
