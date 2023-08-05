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

import { getAllClinic } from '../../services/userService'

import ExaminationHistoryModal from '../Patient/Doctor/Modal/ExaminationHistoryModal';

import { Link } from 'react-router-dom';

// const KEYS_TO_FILTERS = ['user.name', 'subject', 'dest.name']

const KEYS_TO_FILTERS = ['id', 'name']

class HomeHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataClinic: [],
            searchTerm: '',
            isOpenModalBooking: false
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

    }

    handleClickScheduleTime = () => {
        this.setState({
            isOpenModalBooking: true,
        })
    }

    closeBookingClose = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    render() {
        const filteredEmails = this.state.dataClinic.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

        return (
            <React.Fragment>
                <div className="home-header-container">
                    <div className="home-header-content">
                        <div className="left-content">
                            <i className="fas fa-bars"></i>
                            <img className="header-logo" src={logo} onClick={() => this.returnToHome()} />
                        </div>
                        <div className="center-content">
                            <div className="child-content">
                                <div><b><FormattedMessage id="home-header.speciality" /></b></div>
                                <div className="sub-titile"><FormattedMessage id="home-header.search-doctor" /></div>
                            </div>
                            <div className="child-content">
                                <div><b><FormattedMessage id="home-header.health-facility" /></b></div>
                                <div className="sub-titile"><FormattedMessage id="home-header.select-room" /></div>
                            </div>
                            <div className="child-content">
                                <div><b><FormattedMessage id="home-header.doctor" /></b></div>
                                <div className="sub-titile"><FormattedMessage id="home-header.select-doctor" /></div>
                            </div>
                            <div className="child-content">
                                <div><b><FormattedMessage id="home-header.fee" /></b></div>
                                <div className="sub-titile"><FormattedMessage id="home-header.check-health" /></div>
                            </div>

                        </div>



                        <div className="right-content">
                            <ExaminationHistoryModal
                                isOpenModal={this.state.isOpenModalBooking}
                                closeBookingClose={this.closeBookingClose}
                                dataTime={null}
                                doctorId={1}
                            />
                            <div onClick={() => this.handleClickScheduleTime()} className="support fake">
                                <i  class="fab fa-searchengin"></i>
                                <div className="sub-titile">Tra cứu lịch sử khám</div>
                            </div>

                            <div className="support">
                                <i className="far fa-question-circle"></i>
                                <div className="sub-titile"><FormattedMessage id="home-header.support" /></div>
                            </div>
                            <div className="flag">
                                <span className={this.props.language === LANGUAGES.VI ? "language-vi active" : "language-vi"} onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span>
                                <span className={this.props.language === LANGUAGES.EN ? "language-en active" : "language-en"} onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span>
                            </div>
                        </div>

                    </div>

                </div>

                {this.props.isShowBanner === true &&
                    <div className="home-header-banner" >
                        <div className="content-up">
                            <div className="title1"><FormattedMessage id="banner.title1" /></div>
                            <div className="title2"><FormattedMessage id="banner.title2" /></div>
                            <div className="search" onClick={() => this.handleClickSearch()}>
                                <i className="fas fa-search"></i>
                                {/* <input type="text" placeholder="Tìm chuyên khoa" /> */}
                                <SearchInput className="search-input" placeholder="Tìm cơ sở y tế" onChange={this.searchUpdated} />

                            </div>
                            <Search
                                clickSearch={this.state.clickSearch}
                                filteredEmails={filteredEmails}
                            />

                        </div>
                        <div className="content-down">
                            <div className="options">
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-hospital-alt"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child1" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-mobile-alt"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child2" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-notes-medical"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child3" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-vial"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child4" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-user-md"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child5" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-briefcase-medical"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child6" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
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
