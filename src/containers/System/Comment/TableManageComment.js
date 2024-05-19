import React, { Component } from "react";
import { FormattedMessage } from 'react-intl';
import { connect } from "react-redux";
import './TableManageComment.scss';
import * as actions from "../../../store/actions";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import 'react-markdown-editor-lite/lib/index.css';
import { getCommentByPageNumber, deleteComment } from '../../../services/userService';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import moment from "moment";

import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

const mdParser = new MarkdownIt();



function handleEditorChange({ html, text }) {
    console.log('Handle Editor Change', html, text);
}

class TableManageComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataComment: [],
            pageNumber: 1,
            limit: 10
        }
    }

    async componentDidMount() {
        this.props.fetchUserRedux();
        this.getDataPageNumber(this.state.limit, this.state.pageNumber);
    }

    getDataPageNumber = async (limit, pageNumber) => {
        let res = await getCommentByPageNumber(limit, pageNumber);
        if (res && res.errCode == 0) {
            this.setState({
                dataComment: res.data
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
            let res = await deleteComment({ commentId: user.id });

            if (res && res.errCode == 0) {
                toast.success('Xóa bình luận thành công!')
                this.getDataPageNumber(this.state.limit, this.state.pageNumber);
            } else {
                toast.error('Xóa bình luận thất bại!')
    
            }
        } else {
            return;
        }

    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user)
    }

    handleNextTableNumber = async () => {
        await this.getDataPageNumber(this.state.limit, this.state.pageNumber + 1);
        this.setState({
            pageNumber: this.state.pageNumber + 1
        })
    }

    handleBackTableNumber = async () => {
        await this.getDataPageNumber(this.state.limit, this.state.pageNumber - 1);
        this.setState({
            pageNumber: this.state.pageNumber - 1
        })
    }



    render() {
        console.log('state: ', this.state)
        let { dataComment } = this.state
        return (
            <React.Fragment>
                <table id="TableManageUser">
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th>Email người dùng</th>
                            <th>Tên người dùng</th>
                            <th>Vào mã bác sĩ</th>
                            <th>Vào mã chuyên khoa</th>
                            <th>Thời gian</th>
                            <th>Nội dung</th>
                            <th>Hành động</th>
                        </tr>
                        {dataComment && dataComment.length > 0 &&
                            dataComment.map((item, index) => {
                                if (item.userData) {
                                    return (
                                        <tr key={index}>
                                            <td>1</td>
                                            <td>{item.userData.email}</td>
                                            <td>{item.userData.firstName}</td>
                                            <td>{item.doctorId}</td>
                                            <td>{item.specialtyId}</td>
                                            <td>
                                                {moment(item.createdAt).format('DD/MM/YYYY')}

                                            </td>
                                            <td>{item.content}</td>

                                            <td>
                                                <button
                                                    onClick={() => this.handleDeleteUser(item)}
                                                    className="btn-delete">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }

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
                            this.state.dataComment && this.state.dataComment.length > 0 &&
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManageComment);