import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HandBook.scss';
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllSpecialty, getAllHandbook } from '../../../services/userService';
import { withRouter } from 'react-router';

import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';



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
            <div className='handbook-section'>
                <div className='handbook-title'>Cẩm nan mới</div>
                <div className='handbook-main-section'>
                    <div className='left-content'>
                        <img className="img"
                            src={dataSpecialty && dataSpecialty.length > 0 ? dataSpecialty[0].image : ''}
                        />
                        <div className='title-left-content'>{dataSpecialty && dataSpecialty.length > 0 ? dataSpecialty[0].title : ''}</div>
                        <Link to={`/detail-handbook/${dataSpecialty && dataSpecialty.length > 0 ? dataSpecialty[0].id : 1}`} className='btn btn-primary'>Xem bài viết này</Link>{' '}

                    </div>
                    <div className='right-content'>
                        {dataSpecialty && dataSpecialty.length > 1 &&
                            dataSpecialty.map((item, index) => {
                                if (index > 0 && index < 8) {
                                    return (
                                        <div onClick={() => this.handleViewDetailSpecialty(item)} className='content-item'>
                                            <img className="img"
                                                src={item.image}
                                            />
                                            <div className='title-right-content'>
                                                {item.title}
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }


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
