import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './DetailExaminationHistory.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtrainfor from '../Doctor/DoctorExtrainfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import ProfileClinic from '../Doctor/ProfileClinic';
import { getAllDetailClinicById, getAllCodeService, getPatientData } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import moment from 'moment';



class DetailExaminationHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
            arrInfor: []
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getAllDetailClinicById({
                id: id
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId
                })
            }
        }
        this.getInfo()
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
        console.log('hehe')
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    render() {



        var dateReal;

        var birthday;



        // if (this.state.arrInfor && this.state.arrInfor.data) {
        //     var date = this.state.arrInfor.data[0].date
        //     console.log('dateTime: ', this.state.arrInfor.data[0].date)
        //     dateReal = moment.unix(+date / 1000).format('DD/MM/YYYY')
        //     console.log('dateReal: ', dateReal)

        // }

        if (this.state.arrInfor && this.state.arrInfor.data && this.state.arrInfor.data.length > 0) {
            this.state.arrInfor.data.map(item => {
                var date = item.patientHistoryData.birthday
                item.patientHistoryData.birthday = moment.unix(+date / 1000).format('DD/MM/YYYY')
                return item;
            })
        }


        console.log('props: ', this.props)
        console.log('state: ', this.state)



        let { arrDoctorId, dataDetailClinic, arrInfor } = this.state

        return (
            <div className='detail-specialty-container'>
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
                    {arrInfor.data && arrInfor.data.length > 0 &&
                        arrInfor.data.map((item, index) => {
                            return (
                                <div className='each-doctor' key={index}>


                                    <div className='dt-content-mid'>
                                        <div className='doctor-schedule'>
                                            {/* <DoctorSchedule
                                                doctorIdFromParent={item.doctorId}
                                            /> */}
                                            <ProfileDoctor
                                                doctorId={item.doctorId}
                                                isShowDescriptionDoctor={true}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}
                                            // dataTime={dataTime}
                                            />
                                        </div>
                                        <div className='doctor-extra-infor'>
                                            <DoctorExtrainfor
                                                doctorIdFromParent={item.doctorId}
                                            />
                                        </div>

                                    </div>

                                    <div className='dt-content-mid'>
                                        <div className='doctor-schedule'>


                                            <ProfileClinic

                                                clinicId={item.doctorHistoryData.Doctor_Infor.clinicId}
                                                doctorId={item.doctorId}
                                                isShowDescriptionDoctor={true}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}

                                            />
                                        </div>

                                    </div>

                                    <div className='dt-content-right'>
                                        {/* <div className='doctor-schedule'>
                                            <DoctorSchedule
                                                doctorIdFromParent={item.doctorId}
                                            />
                                        </div>
                                        <div className='doctor-extra-infor'>
                                            <DoctorExtrainfor
                                                doctorIdFromParent={item.doctorId}
                                            />
                                        </div> */}
                                        <div className='header-patient'>
                                            <span>Thông tin người khám</span>
                                        </div>
                                        <div className='body-patient'>
                                            <div>Họ tên: <span>{item.patientHistoryData.firstName}</span></div>
                                            <div>Ngày sinh: <span>{moment(item.patientHistoryData.birthday).format('LL')}</span></div>
                                            <div>Giới tính: <span>{item.patientHistoryData.genderData.valueVi}</span></div>
                                        </div>

                                        <div className='footer-patient'>
                                            <div>Ngày khám: <span>{moment(item.createdAt).format('LLLL')}</span></div>
                                            <div>Đơn thuốc: </div>
                                            <div
                                                onClick={() => this.handleClickImage(item.image)}
                                                className='img'
                                                style={{ backgroundImage: `url(${item && item.image ? item.image : ''})` }}
                                            >
                                                
                                            </div>
                                            <div onClick={() => this.handleCancelImage()} className='fullpage'></div>

                                        </div>

                                    </div>
                                </div>

                            )
                        })
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailExaminationHistory);