import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { postDeleteSchedule } from "../../services/userService";
import HomeHeader from '../HomePage/HomeHeader';
import './DeleteSchedule.scss';

class DeleteSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0,
            STT: ''
        }
    }

    async componentDidMount() {
        console.log(this.props)
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            let res = await postDeleteSchedule({
                token: token,
                doctorId: doctorId
            })

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode,
                    STT: res.STT
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }



    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    render() {
        let { statusVerify, errCode } = this.state
        return (
            <>
                <HomeHeader />
                <div className='verify-email-container'>
                    {statusVerify === false ?
                        <div>
                            Loading data...
                        </div> :
                        <div>
                            {+errCode === 0 ?
                                <>
                                    <div className='infor-booking'>Xác nhận hủy lịch hẹn thành công</div>
                                </>
                                :
                                <div className='infor-booking'>Lịch hẹn không tồn tại hoặc đã hủy từ trước!</div>
                            }
                        </div>
                    }

                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteSchedule);