import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HandBook.scss';
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllSpecialty, getAllHandbook } from '../../../services/userService';
import { withRouter } from 'react-router';


class HandBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSpecialty: []
        }
    }

    async componentDidMount() {
        let res = await getAllHandbook();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            })
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${item.id}`)
        }
    }

    goToHandbook = () => {
        if (this.props.history) {
            this.props.history.push(`/handbook/1`)
        }
    }

    render() {

        let { dataSpecialty } = this.state;
        return (
            <div className="section-share section-handbook">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            {/* <FormattedMessage id="homepage.specialty-poplular" /> */}
                            Cẩm nan
                        </span>
                        <button onClick={() => this.goToHandbook()}   className="btn-section">
                            <FormattedMessage id="homepage.more-infor" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {dataSpecialty && dataSpecialty.length > 0 &&
                                dataSpecialty.map((item, index) => {
                                    return (
                                        <div
                                            className='section-customize specialty-child'
                                            key={index}
                                            onClick={() => this.handleViewDetailSpecialty(item)}
                                        >
                                            <div
                                                className='bg-image section-specialty'
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />

                                            <div className='specialty-name'>{item.title}</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HandBook));
