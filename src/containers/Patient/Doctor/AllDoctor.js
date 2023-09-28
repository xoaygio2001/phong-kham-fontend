import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './AllDoctor.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtrainfor from '../Doctor/DoctorExtrainfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import ProfileClinic from '../Doctor/ProfileClinic';
import { getAllDetailClinicById, getAllCodeService, getPatientData, getAllDoctorVer2 } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import moment from 'moment';



class AllDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
            arrInfor: [],
            arrDoctor: [],
            maxDataNumber: 0,
            limit: 10
        }
    }

    async componentDidMount() {
        let res = await getAllDoctorVer2(this.state.limit, this.props.match.params.id)
        if (res && res.errCode === 0) {
            this.setState({
                arrDoctor: res.data,
                maxDataNumber: res.maxDataNumber
            })
        }
    }

    getInfo = async () => {
        let data = await getPatientData(this.props.match.params.id)
        this.setState({
            arrInfor: data
        })
    }

    handleClickImage = (image) => {
        var fullPage = document.querySelector('.footer-patient .fullpage')
        fullPage.style.display = 'block';
        fullPage.style.backgroundImage = 'url(' + image + ')';
    }

    handleCancelImage = () => {
        var fullPage = document.querySelector('.footer-patient .fullpage')
        fullPage.style.display = 'none';
        fullPage.style.backgroundImage = '';
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

        if (this.props.match.params.id !== prevProps.match.params.id) {
            let res = await getAllDoctorVer2(this.state.limit, this.props.match.params.id)
            if (res && res.errCode === 0) {
                this.setState({
                    arrDoctor: res.data,
                    maxDataNumber: res.maxDataNumber
                })
            }
        }
    }

    handleChangePageNumber = (pageNumber) => {
        if (this.props.history) {
            this.props.history.push(`/all-doctor/${pageNumber}`)
        }
    }

    render() {

        let { arrDoctor, maxDataNumber, limit } = this.state

        var dateReal;

        var birthday;

        if (this.state.arrInfor && this.state.arrInfor.data && this.state.arrInfor.data.length > 0) {
            this.state.arrInfor.data.map(item => {
                var date = item.patientHistoryData.birthday
                item.patientHistoryData.birthday = moment.unix(+date / 1000).format('DD/MM/YYYY')
                return item;
            })
        }

        let maxPageNumber = Math.floor(maxDataNumber / limit);
        let currentPage = this.props.match.params.id

        let arrPage = [];

        if (currentPage == 1) {
            if(maxPageNumber > 3) {
                arrPage = [1, 2, maxPageNumber]
            } else if(maxPageNumber == 2) {
                arrPage = [1, 2]
            } else {
                arrPage = [1]
            }
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



        let { arrDoctorId, dataDetailClinic, arrInfor } = this.state

        return (
            <div className='all-doctor-container'>
                <HomeHeader />
                <div className='detail-specialty-body'>
                    <div className='description-spcialty'>
                        {dataDetailClinic && !_.isEmpty(dataDetailClinic)
                            &&
                            <>
                                <div>{dataDetailClinic.name}</div>
                                <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }}>

                                </div>
                            </>
                        }
                    </div>
                    {arrDoctor && arrDoctor.length > 0 &&
                        arrDoctor.map((item, index) => {
                            return (
                                <div className='each-doctor' key={index}>


                                    <div className='dt-content-mid cc'>
                                        <div className='doctor-schedule'>
                                            {/* <DoctorSchedule
                                                doctorIdFromParent={item.doctorId}
                                            /> */}
                                            <ProfileDoctor
                                                doctorId={item.id}
                                                isShowDescriptionDoctor={true}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}
                                            // dataTime={dataTime}
                                            />
                                        </div>
                                        <div className='doctor-extra-infor'>
                                            <DoctorExtrainfor
                                                doctorIdFromParent={item.id}
                                            />
                                        </div>

                                    </div>

                                </div>

                            )
                        })
                    }

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
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllDoctor);