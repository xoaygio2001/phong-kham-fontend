import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { FormattedMessage } from 'react-intl'
import { LANGUAGES } from '../../utils';
import { changeLanguageApp } from '../../store/actions'
import logo from '../../assets/images/logo.svg'
import { withRouter } from 'react-router'

import SearchInput, { createFilter } from 'react-search-input'

import Search from './Section/Search';

import { getAllClinic, getSuggestClinicByRegion } from '../../services/userService'

import ExaminationHistoryModal from '../Patient/Doctor/Modal/ExaminationHistoryModal';

import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from '../../assets/images/bacsinoibat.jpg';

import LoginModal from '../Patient/Doctor/Modal/LoginModal';

// const KEYS_TO_FILTERS = ['user.name', 'subject', 'dest.name']

const KEYS_TO_FILTERS = ['id', 'name']

class HomeHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataClinic: [],
            searchTerm: '',
            isOpenModalBooking: false,
            isOpenModalBooking2: false,
            dataClinic: [],
            region: 'Can tho',
            keyWord: ''
        }
        this.searchUpdated = this.searchUpdated.bind(this)
    }

    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }

    handleClickSearch = () => {
        this.setState({
            clickSearch: !this.state.clickSearch
        })
    }

    TurnOffSearch = () => {
        this.setState({
            clickSearch: false
        })
    }

    async componentDidMount() {
        var res = await getAllClinic();
        if (res && res.errCode === 0 && res.data && res.data.length > 0) {
            this.setState({
                dataClinic: res.data
            })
        }

        let region = ''
        // fetch(`https://api.ipify.org?format=json`)
        //     .then((response) => response.json())
        //     .then((ip) => {
        //         fetch(`http://ipinfo.io/${ip.ip}?token=d7ede721f85e12`)
        //             .then((res) => res.json())
        //             .then(async (data) => {
        //                 region = data.region.toUpperCase()
        //                 let res = await getSuggestClinicByRegion(8, region);
        //                 // let res = await getAllClinic();
        //                 if (res && res.errCode === 0) {
        //                     this.setState({
        //                         dataClinic: res.data ? res.data : []
        //                     })
        //                 }
        //                 this.setState({
        //                     region: data.region
        //                 })
        //             })
        //     })

    }

    handleClickScheduleTime = () => {
        this.setState({
            isOpenModalBooking: true,
        })
    }

    handleClickScheduleTime2 = () => {
        this.setState({
            isOpenModalBooking2: true,
        })
    }

    closeBookingClose = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    closeBookingClose2 = () => {
        this.setState({
            isOpenModalBooking2: false
        })
    }

    findByOptions = (key) => {
        switch (key) {
            case 'DOCTOR_BY_SPECIALTY':
                if (this.props.history) {
                    this.props.history.push(`/specialty`)
                }
                break;

            case 'CLINIC':
                if (this.props.history) {
                    this.props.history.push(`/clinic/1`)
                }
                break;

            case 'DOCTOR':
                if (this.props.history) {
                    this.props.history.push(`/all-doctor/1`)
                }
                break;

        }
    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }

    gotoClinics = (id) => {
        if (this.props.history) {
            this.props.history.push(`detail-clinic/${id}`)
        }
    }

    render() {
        const filteredEmails = this.state.dataClinic.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
        let { dataClinic } = this.state

        return (
            <>
                <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary header-of-homepage">
                    <Container>
                        <Link className="navbar-brand" to="/home">Juri Booking</Link>

                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Link className="nav-link" to="/all-doctor/1">Bác sĩ</Link>
                                <Link className="nav-link" to="/clinic/1">Cơ sở y tế</Link>
                                <Link className="nav-link" to="/specialty">Chuyên khoa</Link>
                                <Link className="nav-link" to="/handbook/1">Cẩm nan</Link>

                                <Form className="d-flex">
                                    <Form.Control
                                        onChange={(e) => this.handleOnChangeInput(e, 'keyWord')}
                                        value={this.state.keyWord}
                                        type="search"
                                        placeholder="Tìm cơ sở y tế"
                                        className="me-2"
                                        aria-label="Search"
                                    />
                                    <Link to={`/search-clinic/${this.state.keyWord}`} className='btn btn-outline-success'>Tìm</Link>
                                </Form>

                            </Nav>
                            <Nav>
                                <div onClick={() => this.handleClickScheduleTime()} className='nav-link'>Tra cứu lịch sử khám</div>
                                <ExaminationHistoryModal
                                    isOpenModal={this.state.isOpenModalBooking}
                                    closeBookingClose={this.closeBookingClose}
                                    dataTime={null}
                                    doctorId={1}
                                />

                                <LoginModal
                                    isOpenModal2={this.state.isOpenModalBooking2}
                                    closeBookingClose2={this.closeBookingClose2}
                                    dataTime={null}
                                    doctorId={1}
                                />


                                <div className={this.props.language === LANGUAGES.VI ? "nav-link header-language active" : "nav-link header-language"} onClick={() => this.changeLanguage(LANGUAGES.VI)}>Vn</div>
                                <div className={this.props.language === LANGUAGES.EN ? "nav-link header-language active" : "nav-link header-language"} onClick={() => this.changeLanguage(LANGUAGES.EN)}>En</div>
                                <div className='nav-link'><i class="fas fa-bell"></i></div>
                                <div onClick={() => this.handleClickScheduleTime2()} className='nav-link'>Đăng nhập</div>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                {this.props.isShowBanner == true &&
                    <div className='outstanding-clinics'>
                        <Carousel className="clinic-carousel">

                            {dataClinic && dataClinic.length > 0 &&
                                dataClinic.map((item, index) => {
                                    return (
                                        <Carousel.Item className="clinic-item">
                                            <img className="img"
                                                src={item.image}
                                            />
                                            <Carousel.Caption className='need-cursor' onClick={() => this.gotoClinics(item.id)}>
                                                <h3>{item.name}</h3>
                                                <h4>{item.provinceTypeData.valueVi}</h4>
                                            </Carousel.Caption>
                                        </Carousel.Item>
                                    )
                                })
                            }


                        </Carousel>
                    </div>
                }


            </>

        );
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
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
