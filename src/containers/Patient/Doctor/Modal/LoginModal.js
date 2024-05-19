import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './LoginModal.scss';
import { Form, Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions';
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookAppointment, getPatientByGmail, handleLogin } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

import { withRouter } from 'react-router';



class LoginModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            doctorId: '',
            genders: '',
            timeType: '',
            gmail: '',
            isShowLoading: false,
            username: '',
            password: '',
            errMessage: ''

        }
    }

    async componentDidMount() {
        this.props.getGenders();
        this.setState({
            username: '',
            password: ''
        })
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object)
            })
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })

        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
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

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption });
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ?
                dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');

            return `${time} -${date}`;

        }
        return '';

    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                :
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            return name;
        }
        return '';
    }

    handleConfirmBooking = async () => {
        //validate input
        //
        this.setState({
            isShowLoading: true
        })
        let date = new Date(this.state.birthday).getTime();
        var currentTime = new Date().getTime();

        if (date > currentTime) {
            this.setState({
                isShowLoading: false
            })
            toast.error('Ngày sinh không phù hợp!')
            return;
        }

        let timeString = this.buildTimeBooking(this.props.dataTime)
        let doctorName = this.buildDoctorName(this.props.dataTime)

        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            birthday: date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })

        this.setState({
            isShowLoading: false
        })

        if (res && res.errCode === 3) {
            toast.error(res.errMessage);
            this.props.closeBookingClose2();

        } else {

            if (res && res.errCode === 0) {
                toast.success('Booking a new appointment succeed!');
                this.props.closeBookingClose2();
            } else {
                toast.error('Vui lòng kiểm tra lại địa chỉ email!')
            }
        }
    }

    handleChangeGmail = (event) => {
        this.setState({
            gmail: event.target.value
        })
    }

    handleSearchData = async () => {
        if (this.state.gmail != '') {
            var res = await getPatientByGmail(this.state.gmail);
            if (res && res.data && res.data.id) {
                if (this.props.history) {
                    this.props.history.push(`/detail-examination-history/${res.data.id}`);
                }
            }
            else {
                toast.error("Email không tồn tại trong hệ thống");
            }

        }

    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        let data = await handleLogin(this.state.username, this.state.password);
        if (data && data.errCode != 0) {
            this.setState({
                errMessage: data.message
            });
            toast.error(data.message)
        }
        if (data && data.errCode == 0) {
            await this.props.userLoginSuccess(data.user);
            this.props.history.push(`/doctor/manage-schedule`);
        }

    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    TryClearData = () => {
        this.setState({
            username: '',
            password: ''
        })
        this.props.closeBookingClose2()
    }

    render() {

        let { isOpenModal2, closeBookingClose2, dataTime } = this.props;
        let doctorId = '';
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = this.props.doctorId
        }

        return (
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading...'
            >


                <Modal
                    isOpen={isOpenModal2}
                    className={'booking-modal-container'}
                    size="lg"
                    centered
                >

                    <div className='booking-modal-content'>
                        <div className='booking-modal-header'>
                            <span className='left'>
                                Đăng nhập vào hệ thông (chỉ dành cho quản lý và bác sĩ)
                            </span>
                            <span
                                className='right'
                                onClick={() => this.TryClearData()}
                            > <i className='fas fa-times'></i>
                            </span>
                        </div>
                        <div className='booking-modal-body'>
                            {/* */}
                            <label>
                                Tài khoản
                            </label>
                            <div className='input-comment'>
                                <input className='form-control'
                                    placeholder='Nhập tài khoản vào đây'
                                    onChange={(event) => this.handleOnChangeText(event, 'username')}
                                    value={this.state.username}
                                />
                            </div>

                            <label>
                                Mật khẩu
                            </label>
                            <div className='input-comment'>
                                <input className='form-control'
                                    type='password'
                                    placeholder='Nhập mật khẩu vào đây'
                                    onChange={(event) => this.handleOnChangeText(event, 'password')}
                                    value={this.state.password}
                                />
                            </div>

                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn-booking-confirm'
                                onClick={() => this.handleLogin()}
                            >
                                <FormattedMessage id="patient.booking-modal.btnConfirm" />
                            </button>
                            <button className='btn-booking-cancel'
                                onClick={() => this.TryClearData()}
                            >
                                <FormattedMessage id="patient.booking-modal.btnCancel" />
                            </button>
                        </div>

                    </div>
                </Modal>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))

    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginModal));