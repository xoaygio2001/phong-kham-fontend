import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './ManageSpecialty.scss';
import MarkdownIt from "markdown-it";
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from "../../../utils";
import {
    createNewSpecialty,
    getAllSpecialty,
    getAllDetailSpecialtyById,
    EditSpecialty,
    DeleteSpecialty
} from "../../../services/userService";

import { toast } from "react-toastify";

import Select from 'react-select';

const mdParser = new MarkdownIt(/* ~~ */);

class ManageSpecialty extends Component {

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
        let res = await getAllSpecialty();
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

            let res = await createNewSpecialty(this.state);
            if (res && res.errCode === 0) {
                toast.success('Thêm chuyên khoa thành công!')
                this.setState({
                    id: '',
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    selectedSpecialty: ''
                })
            } else {
                toast.error('Thêm chuyên khoa thất bại....')
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

            let res = await EditSpecialty(this.state);
            if (res && res.errCode === 0) {
                toast.success('Sửa thông tin chuyên khoa thành công!')
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
                toast.error('Sửa thông tin chuyên khoa thất bại....')
                console.log('>> hoi dan it check res: ', res)
            }
        }

        if (type == 'delete') {
            if (!this.state.id) {
                toast.error('Chưa có chuyên khoa nào được chọn!');
                return;
            }

            if (!window.confirm("Bạn có thật sự muốn xóa!")) { return; }

            let res = await DeleteSpecialty(this.state.id);
            if (res && res.errCode === 0) {
                toast.success('Xóa thông tin chuyên khoa thành công!')
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
                toast.error('Xóa thông tin chuyên khoa thất bại....')
                console.log('>> hoi dan it check res: ', res)
            }
        }

        this.getAllSpecialty()

    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name + ` (ID: ${item.id})`;
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


        let res = await getAllDetailSpecialtyById(temp);
        // if (res && res.errCode === 0 && res.data && res.data.descriptionMarkdown) {

        //     let descriptionMarkdown = res.data.descriptionMarkdown;
        this.setState({
            descriptionMarkdown: res.data.descriptionMarkdown,
            descriptionHTML: res.data.descriptionHTML,
            id: res.data.id,
            name: res.data.name
        })


    };


    render() {
        var { AddSpecialty, listSpecialty } = this.state

        return (
            <div className="manage-specialty-container">
                <div className="ms-title">
                    {AddSpecialty ? 'Thêm chuyên khoa' : 'Quản lý chuyên khoa'}
                </div>
                <button className="btn-add-specialty-clone"
                    onClick={() => this.AddSpecialty()}
                >
                    {AddSpecialty ? 'Quản lý chuyên khoa' : 'Thêm chuyên khoa'}
                </button>


                {!this.state.AddSpecialty &&
                    <div className="add-new-specialty row">

                        <div className="col-6 form-group">
                            <label>Tên chuyên khoa</label>
                            <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChangeSelect}
                                options={this.state.listSpecialty}
                                placeholder="Chọn chuyên khoa"
                            />
                        </div>

                        <div className="col-6 form-group">
                            <label>Ảnh chuyên khoa</label>
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
                                    Lưu chuyên khoa
                                </button>
                            }


                            {this.state.selectedOption &&
                                <button className="btn-delete-specialty"
                                    onClick={() => this.handleSaveNewSpecialty('delete')}
                                >
                                    Xóa chuyên khoa
                                </button>
                            }


                        </div>

                    </div>
                }

                {
                    this.state.AddSpecialty &&
                    <div className="add-new-specialty row">

                        <div className="col-6 form-group">
                            <label>Tên chuyên khoa</label>
                            <input className="form-control" type="text" value={this.state.name}
                                onChange={(event) => this.handleOnChangeInput(event, 'name')}
                            />
                        </div>

                        <div className="col-6 form-group">
                            <label>Ảnh chuyên khoa</label>
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
                                Thêm chuyên khoa
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);