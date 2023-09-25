import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './AllSpecialty.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtrainfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getAllDetailSpecialtyById, getAllCodeService, getAllSpecialty } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
class AllSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: [],
            arrSpecialty: [],
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty()
        console.log('res: ', res)
        if (res && res.errCode === 0) {
            this.setState({
                arrSpecialty: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    handleOnChangeSelect = async (event) => {

    }


    handleGoToDetailSpecialty = (id) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${id}`)
        }
    }


    render() {
        let { arrDoctorId, dataDetailSpecialty, listProvince, arrSpecialty } = this.state;
        let { language } = this.props;
        return (
            <div className='specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-body'>
                    <div className='description-spcialty'>
                    </div>

                    <div className='each-doctor'>

                        {arrSpecialty && arrSpecialty.length > 0 &&
                            arrSpecialty.map((item, index) => {
                                return (
                                    <div onClick={() => this.handleGoToDetailSpecialty(item.id)} className='content-specialty'>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllSpecialty);