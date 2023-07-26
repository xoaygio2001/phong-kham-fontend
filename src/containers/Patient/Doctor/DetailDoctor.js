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
import moment from 'moment';
import NodeGeocoder from 'node-geocoder';

import FontAwesomeIcon from '@fortawesome/fontawesome-free-webfonts'


class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
            comment: '',
            commentArr: '',
            star: 0,
            activeStar: 5
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

            if (res.data.length > 0) {

                let divide = 0;
                let sum = 0;

                res.data.map((item, index) => {
                    divide++;
                    sum = sum + item.rate
                })

                let star = (sum / divide).toFixed(1);

                this.setState({
                    commentArr: res.data,
                    star: star
                })

            }

        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleChangeComment = (event) => {
        this.setState({
            comment: event.target.value
        })
    }

    ClickStart = (point) => {
        this.setState({
            activeStar: point
        })
    }

    handleSubmitComment = async () => {
        if (this.state.comment) {
            var email = prompt('Nhập email mà bạn đã thăm khám vào đây!');
            if (this.state.comment && email) {
                var res = await submitComment({
                    email: email,
                    comment: this.state.comment,
                    doctorId: this.state.detailDoctor.id,
                    rate: this.state.activeStar
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
                if (email != null) {
                    toast.error('Vui lòng điền đầy đủ thông tin!')
                }

            }
        }
        else {
            toast.error('Vui lòng nhập cảm nhận vào ô phản hồi!')
        }

    }

    render() {

        




        let { language } = this.props;
        let { detailDoctor, commentArr, activeStar, star } = this.state;
        let nameVi = '', nameEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueVi}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

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

                                {star == 0 ? <div className='like-share-plugin'>Hiện chưa có lượt đánh giá nào</div>
                                    :

                                    <div className='like-share-plugin'>
                                        {
                                            star > 0 ?
                                                <i className="fa fa-solid fa-star sao1"></i>
                                                :
                                                <i className="far fa-solid fa-star sao1"></i>
                                        }

                                        {
                                            star > 1.5 ?
                                                <i className="fa fa-solid fa-star sao1"></i>
                                                :
                                                <i className="far fa-solid fa-star sao1"></i>
                                        }

                                        {
                                            star > 2.5 ?
                                                <i className="fa fa-solid fa-star sao1"></i>
                                                :
                                                <i className="far fa-solid fa-star sao1"></i>
                                        }

                                        {
                                            star > 3.5 ?
                                                <i className="fa fa-solid fa-star sao1"></i>
                                                :
                                                <i className="far fa-solid fa-star sao1"></i>
                                        }

                                        {
                                            star > 4.5 ?
                                                <i className="fa fa-solid fa-star sao1"></i>
                                                :
                                                <i className="far fa-solid fa-star sao1"></i>
                                        }

                                        {
                                            star != 0 && ` ${star} / 5 sao`
                                        }


                                    </div>
                                }

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
                        {
                            activeStar > 0 ?
                                <i onClick={() => this.ClickStart(1)} className="fa fa-solid fa-star sao1"></i>
                                :
                                <i onClick={() => this.ClickStart(1)} className="far fa-solid fa-star sao1"></i>
                        }

                        {
                            activeStar > 1 ?
                                <i onClick={() => this.ClickStart(2)} className="fa fa-solid fa-star sao1"></i>
                                :
                                <i onClick={() => this.ClickStart(2)} className="far fa-solid fa-star sao1"></i>
                        }

                        {
                            activeStar > 2 ?
                                <i onClick={() => this.ClickStart(3)} className="fa fa-solid fa-star sao1"></i>
                                :
                                <i onClick={() => this.ClickStart(3)} className="far fa-solid fa-star sao1"></i>
                        }

                        {
                            activeStar > 3 ?
                                <i onClick={() => this.ClickStart(4)} className="fa fa-solid fa-star sao1"></i>
                                :
                                <i onClick={() => this.ClickStart(4)} className="far fa-solid fa-star sao1"></i>
                        }

                        {
                            activeStar > 4 ?
                                <i onClick={() => this.ClickStart(5)} className="fa fa-solid fa-star sao1"></i>
                                :
                                <i onClick={() => this.ClickStart(5)} className="far fa-solid fa-star sao1"></i>
                        }


                        {activeStar == 1 && <i className="">Tệ</i>}
                        {activeStar == 2 && <i className="">Không hài lòng</i>}
                        {activeStar == 3 && <i className="">Bình thường</i>}
                        {activeStar == 4 && <i className="">Hài lòng</i>}
                        {activeStar == 5 && <i className="">Tuyệt vời</i>}



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
                                                </div>

                                                <div>
                                                    {
                                                        item.rate > 0 &&
                                                        <i className="fa fa-solid fa-star saonho1"></i>
                                                    }

                                                    {
                                                        item.rate > 1 &&
                                                        <i className="fa fa-solid fa-star saonho1"></i> &&
                                                        <i className="fa fa-solid fa-star saonho1"></i>
                                                    }

                                                    {
                                                        item.rate > 2 &&
                                                        <i className="fa fa-solid fa-star saonho1"></i> &&
                                                        <i className="fa fa-solid fa-star saonho1"></i> &&
                                                        <i className="fa fa-solid fa-star saonho1"></i>
                                                    }
                                                    {
                                                        item.rate > 3 &&
                                                        <i className="fa fa-solid fa-star saonho1"></i> &&
                                                        <i className="fa fa-solid fa-star saonho1"></i> &&
                                                        <i className="fa fa-solid fa-star saonho1"></i> &&
                                                        <i className="fa fa-solid fa-star saonho1"></i>
                                                    }
                                                    {
                                                        item.rate > 4 &&
                                                        <i className="fa fa-solid fa-star saonho1"></i> &&
                                                        <i className="fa fa-solid fa-star saonho1"></i> &&
                                                        <i className="fa fa-solid fa-star saonho1"></i> &&
                                                        <i className="fa fa-solid fa-star saonho1"></i> &&
                                                        <i className="fa fa-solid fa-star saonho1"></i>
                                                    }
                                                </div>
                                                <div>{moment(item.createdAt).format('LLLL')}</div>
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