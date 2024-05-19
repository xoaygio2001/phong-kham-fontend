import React, { Component } from "react";
import { FormattedMessage } from 'react-intl';
import { connect } from "react-redux";
import './TableManageUser.scss';
import * as actions from "../../../store/actions";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import 'react-markdown-editor-lite/lib/index.css';
import Button from 'react-bootstrap/Button';

import { getUserByPageNumber } from "../../../services/userService"

const mdParser = new MarkdownIt();

function handleEditorChange({ html, text }) {
    console.log('Handle Editor Change', html, text);
}

class TableManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataUsers: [],
            dataComment: [1, 1],
            pageNumber: 1,
            limit: 8

        }
    }

    async componentDidMount() {
        this.props.fetchUserRedux();
        this.getDataPageNumber(this.state.pageNumber);
    }

    getDataPageNumber = async (pageNumber) => {
        let res = await getUserByPageNumber(this.state.limit, pageNumber)
        if (res && res.errCode == 0) {
            this.setState({
                dataUsers: res.data
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                usersRedux: this.props.listUsers
            });
        }
    }

    handleDeleteUser = async (user) => {

        if (window.confirm('Bác có chắc muốn xóa!')) {
            await this.props.deleteAUserRedux(user.id);
            await this.getDataPageNumber(this.state.pageNumber)
        } else {
            return;
        }




    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user)
        this.getDataPageNumber(this.state.pageNumber)

    }

    handleNextTableNumber = async () => {
        await this.getDataPageNumber(this.state.pageNumber + 1);
        this.setState({
            pageNumber: this.state.pageNumber + 1
        })
    }

    handleBackTableNumber = async () => {
        await this.getDataPageNumber(this.state.pageNumber - 1);
        this.setState({
            pageNumber: this.state.pageNumber - 1
        })
    }

    render() {
        let arrUsers = this.state.usersRedux;
        let { dataUsers } = this.state
        return (
            <React.Fragment>
                <table id="TableManageUser">
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <th>Tên đầu</th>
                            <th>Tên cuối</th>
                            <th>Địa chỉ</th>
                            <th>Hành động</th>
                        </tr>
                        {dataUsers && dataUsers.length > 0 &&
                            dataUsers.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button
                                                onClick={() => this.handleEditUser(item)}
                                                className="btn-edit"><i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                onClick={() => this.handleDeleteUser(item)}
                                                className="btn-delete">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div className='bottom-navigate-table'>
                    <div className='page-number'>Trang {this.state.pageNumber}</div>
                    <div className="navigate-btn">
                        {
                            this.state.pageNumber > 1 &&
                            <Button className="go-back" onClick={() => this.handleBackTableNumber()} variant="primary">Lùi lại</Button>
                        }
                        {
                            dataUsers && dataUsers.length > 0 &&
                            <Button onClick={() => this.handleNextTableNumber()} variant="primary">Trang tiếp</Button>
                        }

                    </div>

                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);