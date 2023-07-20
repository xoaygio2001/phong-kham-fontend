import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss';
import { getDetailInforDoctor, submitComment, getCommentByDoctorId } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtrainfor from './DoctorExtrainfor';
import LikeAndShare from '../SocialPlugin/LikeAndShare';
import Comment from '../SocialPlugin/Comment';
import { toast } from 'react-toastify';


class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
            comment: '',
            commentArr: ''
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id
            })

            let res = await getDetailInforDoctor(id);
            if (res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data
                })
            }
        }


        this.loadComment()


    }


    loadComment = async () => {
        let res = await getCommentByDoctorId(this.state.detailDoctor.id);
        if (res && res.errCode === 0) {
            this.setState({
                commentArr: res.data
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleChangeComment = (event) => {
        this.setState({
            comment: event.target.value
        })
    }

    handleSubmitComment = async () => {
        if (this.state.comment) {
            var email = prompt('Nhập email mà bạn đã thăm khám vào đây!')
            if (this.state.comment && email) {
                var res = await submitComment({
                    email: email,
                    comment: this.state.comment,
                    doctorId: this.state.detailDoctor.id
                })

                if (res && res.errCode === 0) {
                    this.loadComment()
                    this.setState({
                        comment: ''
                    })
                    toast.success('Bình luận thành công!');

                } else {
                    toast.error(res.errMessage);
                }
            }
            else {
                toast.error('Vui lòng điền đầy đủ thông tin!')
            }
        }
    }

    render() {

        let { language } = this.props;
        let { detailDoctor, commentArr } = this.state;
        let nameVi = '', nameEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueVi}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        console.log('detailDoctor: ', detailDoctor)
        console.log('commentArr: ', commentArr)

        return (
            <>
                <HomeHeader
                    isShowBanner={false}
                />
                <div className="doctor-detail-container">
                    <div className="intro-doctor">
                        <div
                            className="content-left"
                            style={{ backgroundImage: `url(${detailDoctor.image ? detailDoctor.image : ''})` }}>
                        </div>
                        <div className="content-right">
                            <div className="up">
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className="down">
                                {detailDoctor && detailDoctor.Markdown
                                    && detailDoctor.Markdown.description
                                    &&
                                    <span>
                                        {detailDoctor.Markdown.description}
                                    </span>
                                }
                                <div className='like-share-plugin'>
                                    {/* <LikeAndShare>
                                        dataHref={currentURL}
                                    </LikeAndShare> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="schedule-doctor">
                        <div className="content-left">
                            <DoctorSchedule
                                doctorIdFromParent={this.state.currentDoctorId}
                            />
                        </div>
                        <div className="content-right">
                            <DoctorExtrainfor
                                doctorIdFromParent={this.state.currentDoctorId}
                            />
                        </div>
                    </div>
                    <div className="detail-infor-doctor">
                        {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML
                            &&
                            <div dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }}>

                            </div>
                        }
                    </div>
                    <div className="comment-doctor">
                        <div className='input-comment'>
                            <input className='form-control'
                                placeholder='Cảm nhận của bạn sau khi khám'
                                onChange={(event) => this.handleChangeComment(event)}
                                value={this.state.comment}
                            />
                            <button onClick={() => this.handleSubmitComment()}>Gửi</button>
                        </div>

                        <div className='title-comment'>
                            Phản hồi của bệnh nhân sau khi đi khám
                        </div>
                        <div className='container-comment'>

                            {commentArr && commentArr.length > 0 &&
                                commentArr.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                        >
                                            <hr />
                                            <div className='content-comment'>
                                                <div className='top-comment'>
                                                    <span className='name'>{item.userData.firstName}</span>
                                                    {/* <span className='date-time'>đã khám 2/10/2001</span> */}
                                                </div>
                                                <div className='bottom-comment'>
                                                    <span className='cmt'>{item.content}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>


                    </div>
                </div>
            </>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);