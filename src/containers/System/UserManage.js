import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import {
    getAllUsers,
    createNewUserService,
    deleteUserService,
    editUserService
} from '../../services/userService'
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isShowModal: false,
            isShowModalEditUser: false,
            dataEditUser: ''
        }
    }

    async componentDidMount() {
        this.getAllUsersFromReact();
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('All');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            });
        }
    }

    toggleUserModal = () => {
        this.setState({
            isShowModal: !this.state.isShowModal
        })
    }

    toggleModalEditUser = () => {
        this.setState({
            isShowModalEditUser: !this.state.isShowModalEditUser
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);

            if (response.errCode && response.errCode != 0) {
                alert(response.errMessage);
            }
            else {
                this.toggleUserModal();
                await this.getAllUsersFromReact();
                emitter.emit('EVENT_CLEAR_MODAL_DATA');

            }
        }
        catch (expcept) {
            console.log(expcept)
        }

    }

    handleDeleteUser = async (id) => {

        try {
            let response = await deleteUserService(id);

            if (response.errCode && response.errCode != 0) {
                alert(response.errMessage);
            }
            else {
                this.getAllUsersFromReact();
            }
        }
        catch (expcept) {
            console.log(expcept)
        }
    }

    handleEditUser = (user) => {
        this.setState({
            dataEditUser: user
        });

        this.toggleModalEditUser();
    }

    editUser = async (user) => {
        try {
            let response = await editUserService(user);

            if (response.errCode && response.errCode != 0) {
                alert(response.errMessage);
            }
            else {
                this.toggleModalEditUser();
                await this.getAllUsersFromReact();

            }
        }
        catch (expcept) {
            console.log(expcept)
        }
    }


    render() {
        var arrUsers = this.state.arrUsers
        return (
            <div className="user-container">
                <div className="title text-center">Manage User</div>
                <div>
                    <button
                        onClick={() => this.toggleUserModal()}
                        className="btn btn-primary mx-2 px-2">
                        <i className="fas fa-plus"></i> Têm Người Dùng</button>
                </div>
                <ModalUser
                    isShowModal={this.state.isShowModal}

                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {this.state.isShowModalEditUser &&
                    <ModalEditUser
                        dataEditUser={this.state.dataEditUser}
                        isShowModalEditUser={this.state.isShowModalEditUser}
                        toggleModalEditUser={this.toggleModalEditUser}
                        editUser={this.editUser}
                    />
                }

                <div className="table-user mt-3 mx-3">
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                            {arrUsers && arrUsers.map((item, index) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button
                                                onClick={() => this.handleEditUser(item)}
                                                className="btn-edit"><i className="fas fa-edit"></i></button>
                                            <button
                                                onClick={() => this.handleDeleteUser(item.id)}
                                                className="btn-delete"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
