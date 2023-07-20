import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect, Connect } from "react-redux";
import { dispatch } from "../../redux";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../utils'
import * as actions from '../../store/actions'
import './UserRedux.scss';
import Lightbox from "react-image-lightbox";
import 'react-image-lightbox/style.css';
import TableManageUser from "./admin/TableManageUser";

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            action: '',
            userEditId: '',

            imageBase64: ''
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            });
        }

        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            });
        }

        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            });
        }

        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrRoles = this.props.roleRedux;
            let arrPositions = this.props.positionRedux;

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImgURL: '',

            })
        }
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
            });
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;

        this.setState({
            isOpen: true
        });
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;

        let { action } = this.state;

        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.imageBase64
            })
        }

        if (action === CRUD_ACTIONS.EDIT) {
            this.props.editAllUserRedux({
                id: this.state.userEditId,
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.imageBase64
            })
        }

    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'firstName', 'lastName',
            'phoneNumber', 'address'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('this input is required: ' + arrCheck[i]);
                break;
            }
        }
        return isValid;
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    handleEditUserFromParent = (user) => {

        this.setState({
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            role: user.roleId,
            position: user.positionId,
            avatar: this.state.imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64
            })
        }
    }

    render() {


        let { genderArr, roleArr, positionArr } = this.state
        let { email, password, firstName, lastName, phoneNumber,
            address, gender, position, role, avatar } = this.state
        let language = this.props.language
        let isGetGenders = this.props.isLoadingGender;

        return (
            <div className="user-redux-container">
                <div className="title">
                    Quản lý tài khoản
                </div>
                <div className="user-redux-body mx-5">
                    <div className="col-12">{isGetGenders === true ? 'Loading Gender' : ''}</div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputEmail4">Email</label>
                            <input
                                disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                onChange={(event) => this.onChangeInput(event, 'email')}
                                value={email}
                                type="email" className="form-control" id="inputEmail4" placeholder="Email" />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputPassword4">Password</label>
                            <input
                                disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                onChange={(event) => this.onChangeInput(event, 'password')}
                                value={password}
                                type="password" className="form-control" id="inputPassword4" placeholder="Password" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="input first name">First name</label>
                        <input
                            onChange={(event) => this.onChangeInput(event, 'firstName')}
                            value={firstName}
                            type="text" className="form-control" id="inputAddress" placeholder="" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="input last name">Last name</label>
                        <input
                            onChange={(event) => this.onChangeInput(event, 'lastName')}
                            value={lastName}
                            type="text" className="form-control" id="inputAddress" placeholder="" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="input phone number">Phone number</label>
                        <input
                            onChange={(event) => this.onChangeInput(event, 'phoneNumber')}
                            value={phoneNumber}
                            type="text" className="form-control" id="inputAddress" placeholder="" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputAddress">Address</label>
                        <input
                            onChange={(event) => this.onChangeInput(event, 'address')}
                            value={address}
                            type="text" className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Avatar</label>
                    </div>

                    <div className="col-6 form-group">
                        <input className="form-control-file" type="file"
                            onChange={(event) => this.handleOnChangeImage(event)}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="inputState">Gender</label>
                            <select
                                value={gender}
                                onChange={(event) => this.onChangeInput(event, 'gender')}
                                id="inputState" className="form-control">
                                {genderArr &&
                                    genderArr.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language == LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputState">Position</label>
                            <select
                                value={position}
                                onChange={(event) => this.onChangeInput(event, 'position')}
                                id="inputState" className="form-control">
                                {positionArr &&
                                    positionArr.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language == LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputState">Role</label>
                            <select
                                value={role}
                                onChange={(event) => this.onChangeInput(event, 'role')}
                                id="inputState" className="form-control">
                                {roleArr &&
                                    roleArr.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language == LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => this.handleSaveUser()}
                        type="submit" className="btn btn-primary">Lưu
                    </button>
                </div>

                <div className="col-12 mb-5">
                    <TableManageUser
                        handleEditUserFromParentKey={this.handleEditUserFromParent}
                        action={this.state.action}
                    />
                </div>

                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editAllUserRedux: (data) => dispatch(actions.editAUser(data))

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);