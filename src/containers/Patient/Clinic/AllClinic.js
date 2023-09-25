import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './AllClinic.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtrainfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getAllDetailSpecialtyById, getAllCodeService, getAllSpecialty, getAllClinicByPageNumber } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
class AllClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: [],
            arrSpecialty: [],
            arrClinic: [],

            limit: 2,
            maxDataNumber: 0,
        }
    }

    async componentDidMount() {

        let res = await getAllClinicByPageNumber(this.state.limit, this.props.match.params.id)
        if (res && res.errCode === 0) {
            this.setState({
                arrClinic: res.data,
                maxDataNumber: res.maxDataNumber
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

        if (this.props.match.params.id !== prevProps.match.params.id) {
            let res = await getAllClinicByPageNumber(this.state.limit, this.props.match.params.id)
            if (res && res.errCode === 0) {
                this.setState({
                    arrClinic: res.data
                })
            }
        }
    }

    handleOnChangeSelect = async (event) => {

    }


    handleChangePageNumber = (pageNumber) => {
        if (this.props.history) {
            this.props.history.push(`/clinic/${pageNumber}`)
        }
    }

    handleGoToDetailClinic = (id) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${id}`)
        }
    }


    render() {
        console.log('state: ', this.state)
        console.log('props: ', this.props)
        let {
            arrDoctorId, dataDetailSpecialty, listProvince, arrSpecialty, arrClinic,
            limit, maxDataNumber
        } = this.state;
        let { language } = this.props;

        let maxPageNumber = Math.floor(maxDataNumber / limit);
        let currentPage = this.props.match.params.id

        let arrPage = [];

        if (currentPage == 1) {
            arrPage = [1, 2, maxPageNumber]
        }
        if (currentPage == 2) {
            arrPage = [1, 2, 3, maxPageNumber]
        }
        if (currentPage > 2 && currentPage < maxPageNumber) {
            arrPage = [currentPage - 1, currentPage, +currentPage + 1, maxPageNumber]
        }

        if (currentPage == maxPageNumber && maxPageNumber != 1) {
            arrPage = [currentPage - 1, currentPage]
        }

        if(currentPage == maxPageNumber && maxPageNumber == 1){
            arrPage = [1]
        }



        return (
            <div className='specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-body'>
                    <div className='description-spcialty'>
                    </div>

                    <div className='each-doctor'>

                        {arrClinic && arrClinic.length > 0 &&
                            arrClinic.map((item, index) => {
                                return (
                                    <div onClick={() => this.handleGoToDetailClinic(item.id)} className='content-specialty'>
                                        <div
                                            className='bg-image section-specialty'
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        />
                                        <div className='title'>{item.name}</div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className='nav-pageNumber'>
                        {arrPage && arrPage.length > 0 &&
                            arrPage.map((item, index) => {
                                return (
                                    <div onClick={() => this.handleChangePageNumber(item)} className={item == currentPage ? 'active' : ''}>{item}</div>
                                )
                            })
                        }
                    </div>

                </div>

            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
}

const mapDispatchToProps = dispatch => {
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllClinic);