import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './ManageHandbook.scss';
import MarkdownIt from "markdown-it";
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from "../../../utils";
import {
    createNewSpecialty,
    getAllSpecialty,
    getAllDetailSpecialtyById,
    EditSpecialty,
    DeleteSpecialty,
    createNewHandbook,
    getAllHandbook,
    getAllDetailHandbookById,
    editHandbook,
    deleteHandbook
} from "../../../services/userService";

import { toast } from "react-toastify";

import Select from 'react-select';

const mdParser = new MarkdownIt(/* ~~ */);

class ManageHandbook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            AddSpecialty: false,
            AllSpecialty: [],
            listSpecialty: [],
            selectedSpecialty: '',
            id: '',
            selectedOption: ''
        }
    }

    async componentDidMount() {
        this.getAllSpecialty()
    }

    getAllSpecialty = async () => {
        let res = await getAllHandbook();
        if (res && res.errCode === 0) {
            this.setState({
                AllSpecialty: res.data
            })

            let dataSelect = this.buildDataInputSelect(res.data, 'USERS');
            this.setState({
                listSpecialty: dataSelect
            })

        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text
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

    handleSaveNewSpecialty = async (type) => {

        if (type == 'add') {
            if (
                !this.state.name
                || !this.state.imageBase64
                || !this.state.descriptionHTML
                || !this.state.descriptionMarkdown) {
                toast.error('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            let res = await createNewHandbook(this.state);
            if (res && res.errCode === 0) {
                toast.success('Thêm cẩm nan thành công!')
                this.setState({
                    id: '',
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    selectedSpecialty: ''
                })
            } else {
                toast.error('Thêm cẩm nan thất bại....')
                console.log('>> hoi dan it check res: ', res)
            }
        }

        if (type == 'edit') {
            if (!this.state.id
                || !this.state.name
                || !this.state.descriptionHTML
                || !this.state.descriptionMarkdown) {
                toast.error('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            let res = await editHandbook({
                id: this.state.id,
                title: this.state.name,
                contentHTML: this.state.descriptionHTML,
                contentMarkdown: this.state.descriptionMarkdown,
                contentMarkdown: this.state.descriptionMarkdown,
                imageBase64: this.state.imageBase64
            });
            if (res && res.errCode === 0) {
                toast.success('Sửa thông tin cẩm nan thành công!')
                this.setState({
                    id: '',
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    selectedSpecialty: '',
                    selectedOption: ''
                })
            } else {
                toast.error('Sửa thông tin cẩm nan thất bại....')
                console.log('>> hoi dan it check res: ', res)
            }
        }

        if (type == 'delete') {
            if (!this.state.id) {
                toast.error('Chưa có cẩm nan nào được chọn!');
                return;
            }

            if (!window.confirm("Bạn có thật sự muốn xóa!")) { return; }

            let res = await deleteHandbook({
                id: this.state.id
            });
            if (res && res.errCode === 0) {
                toast.success('Xóa thông tin cẩm nan thành công!')
                this.setState({
                    id: '',
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    selectedSpecialty: '',
                    selectedOption: ''
                })
            } else {
                toast.error('Xóa thông tin cẩm nan thất bại....')
                console.log('>> hoi dan it check res: ', res)
            }
        }


    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.title + ` (ID: ${item.id})`;
                    object.value = item.id;
                    result.push(object);
                })
            }
        }
        return result;

    }



    AddSpecialty = () => {
        this.setState({
            AddSpecialty: !this.state.AddSpecialty,
        })

        this.setState({
            id: '',
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            selectedOption: '',
            selectedSpecialty: ''

        })
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let { selectedSpecialty } = this.state;

        let temp = {};
        temp.id = selectedOption.value
        temp.location = 'All'


        let res = await getAllDetailHandbookById(temp);
        // if (res && res.errCode === 0 && res.data && res.data.descriptionMarkdown) {

        //     let descriptionMarkdown = res.data.descriptionMarkdown;
        this.setState({
            descriptionMarkdown: res.data.contentMarkdown,
            descriptionHTML: res.data.contentHTML,
            id: res.data.id,
            name: res.data.title
        })


    };


    render() {
        var { AddSpecialty, listSpecialty } = this.state

        return (
            <div className="manage-specialty-container">
                <div className="ms-title">
                    {AddSpecialty ? 'Thêm cẩm nang' : 'Quản lý cẩm nang'}
                </div>
                <button className="btn-add-specialty-clone"
                    onClick={() => this.AddSpecialty()}
                >
                    {AddSpecialty ? 'Quản lý cẩm nang' : 'Thêm cẩm nang'}
                </button>


                {!this.state.AddSpecialty &&
                    <div className="add-new-specialty row">

                        <div className="col-6 form-group">
                            <label>Tiêu đề cẩm nang</label>
                            <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChangeSelect}
                                options={this.state.listSpecialty}
                                placeholder="Chọn cẩm nan"
                            />
                        </div>

                        <div className="col-6 form-group">
                            <label>Ảnh cẩm bìa cẩm nang</label>
                            <input className="form-control-file" type="file"
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                        </div>
                        <div className="col-12 md-editor">
                            <MdEditor
                                style={{ height: '300px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={this.state.descriptionMarkdown}
                            />
                        </div>
                        <div className="col-12 button">

                            {this.state.selectedOption &&


                                < button className="btn-edit-specialty"
                                    onClick={() => this.handleSaveNewSpecialty('edit')}
                                >
                                    Lưu cẩm nang
                                </button>
                            }


                            {this.state.selectedOption &&
                                <button className="btn-delete-specialty"
                                    onClick={() => this.handleSaveNewSpecialty('delete')}
                                >
                                    Xóa cẩm nang
                                </button>
                            }

                        </div>

                    </div>
                }

                {
                    this.state.AddSpecialty &&
                    <div className="add-new-specialty row">

                        <div className="col-6 form-group">
                            <label>Tiêu đề cẩm nan</label>
                            <input className="form-control" type="text" value={this.state.name}
                                onChange={(event) => this.handleOnChangeInput(event, 'name')}
                            />
                        </div>

                        <div className="col-6 form-group">
                            <label>Ảnh cẩm nan</label>
                            <input className="form-control-file" type="file"
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                        </div>
                        <div className="col-12 md-editor">
                            <MdEditor
                                style={{ height: '300px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={this.state.descriptionMarkdown}
                            />
                        </div>
                        <div className="col-12 ">
                            <button className="btn-add-specialty"
                                onClick={() => this.handleSaveNewSpecialty('add')}
                            >
                                Thêm cẩm nan
                            </button>
                        </div>

                    </div>
                }
            </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);