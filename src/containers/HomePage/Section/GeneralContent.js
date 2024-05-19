import React, { Component } from 'react';
import { connect } from 'react-redux';
import './GeneralContent.scss';
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
    getAllSpecialty,
    getAllHandbook,
    getOutstandingDoctors,
    getOutstandingSpecialties,
    getOutstandingClinic
} from '../../../services/userService';
import { withRouter } from 'react-router';

import Button from 'react-bootstrap/Button';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';



class GeneralContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeOutstanding: 'doctor',
            dataGeneralContent: [],
            limit: 6
        }
    }

    async componentDidMount() {
        this.setDataGeneralCotent(this.state.activeOutstanding)
    }

    setDataGeneralCotent = async (state) => {
        let { limit } = this.state
        let res;
        switch (state) {
            case 'doctor':
                res = await getOutstandingDoctors(limit)
                console.log('res: ', res)
                if (res && res.errCode == 0 && res.data) {
                    let temp = await res.data.map((item, index) => {
                        let title = `${item.positionData.valueVi}. ${item.firstName} ${item.lastName}`
                        let description = `Chuyên khoa: ${item.Doctor_Infor.SpecialtyTypeData.name}`
                        let image = item.image
                        let id = item.id;
                        let link = 'detail-doctor'
                        return {
                            'title': title,
                            'description': description,
                            'image': image,
                            'id': id,
                            'link': link
                        };
                    })

                    this.setState({
                        dataGeneralContent: temp
                    })
                }
                break;
            case 'specialty':
                res = await getOutstandingSpecialties(limit)
                console.log('res: ', res)
                if (res && res.errCode == 0 && res.data) {
                    let temp = await res.data.map((item, index) => {

                        let title = `${item.name}`
                        let description = ''
                        let image = item.image
                        let id = item.id
                        let link = 'detail-specialty'
                        return {
                            'title': title,
                            'description': description,
                            'image': image,
                            'id': id,
                            'link': link
                        };
                    })

                    this.setState({
                        dataGeneralContent: temp
                    })
                }
                break;
            case 'clinic':
                res = await getOutstandingClinic(limit)
                console.log('res: ', res)
                if (res && res.errCode == 0 && res.data) {
                    let temp = await res.data.map((item, index) => {

                        let title = `${item.name}`
                        let description = `Địa chỉ: ${item.address}`
                        let image = item.image
                        let id = item.id;
                        let link = 'detail-clinic'
                        return {
                            'title': title,
                            'description': description,
                            'image': image,
                            'id': id,
                            'link': link
                        };
                    })

                    this.setState({
                        dataGeneralContent: temp
                    })
                }
                break;
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

    handleChangeActiveOutstanding = (state) => {
        this.setDataGeneralCotent(state)
        this.setState({
            activeOutstanding: state
        })
    }

    render() {

        let { activeOutstanding, dataGeneralContent } = this.state;
        console.log('state: ', this.state)
        return (
            <div className='general-content-section'>
                <div className='general-content-title'>
                    <div
                        onClick={() => this.handleChangeActiveOutstanding('doctor')}
                        className={activeOutstanding == 'doctor' ? 'general-content-title-doctor active' : 'general-content-title-doctor'}>
                        Bác Sĩ Nổi Bật
                    </div>
                    <div
                        onClick={() => this.handleChangeActiveOutstanding('specialty')}
                        className={activeOutstanding == 'specialty' ? 'general-content-title-specialty active' : 'general-content-title-specialty'}>
                        Chuyên Khoa Phổ Biến
                    </div>
                    <div
                        onClick={() => this.handleChangeActiveOutstanding('clinic')}
                        className={activeOutstanding == 'clinic' ? 'general-content-title-clinic active' : 'general-content-title-clinic'}>
                        Cơ Sở Y Tế Nổi Trội
                    </div>
                </div>
                <Container className='general-content-main-section'>
                    <Row>
                        {dataGeneralContent && dataGeneralContent.length > 0 &&
                            dataGeneralContent.map((item, index) => {
                                return (
                                    <Col sm={3} className='content-item'>
                                        <img className={activeOutstanding == 'doctor' ? 'img img-doctor' : 'img'} src={item.image}
                                        />
                                        <div className='title-content-main'>{item.title}</div>
                                        <div className='description'>{item.description}</div>
                                        <div className='buttons'>
                                            <Link to={`/${item.link}/${item.id}`} className='btn btn-primary more-info'>Xem thêm</Link>{' '}
                                            {/* <Button className='more-info' variant="primary">Xem thêm</Button>{' '} */}
                                        </div>
                                    </Col>
                                )
                            })
                        }

                    </Row>
                </Container>

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GeneralContent));
