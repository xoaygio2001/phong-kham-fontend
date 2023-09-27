import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './ManageClinic.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils, LANGUAGES } from '../../../utils';
import {
    createNewClinic,
    createNewSpecialty,
    getAllSpecialty,
    getAllDetailSpecialtyById,
    EditSpecialty,
    DeleteSpecialty,
    getAllClinic,
    getAllDetailClinicById,
    EditClinic,
    DeleteClinic,
    getAllCodeService

} from '../../../services/userService';
import { toast } from 'react-toastify';
import Select from 'react-select';

const mdParser = new MarkdownIt(/* */);

class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            AddSpecialty: false,
            AllSpecialty: [],
            listSpecialty: [],
            selectedSpecialty: '',
            id: '',
            selectedOption: '',
            listProvince: [],
            selectedProvince: ''
        }
    }

    async componentDidMount() {

        this.getAllSpecialty()
        let resProvince = await getAllCodeService("PROVINCE");
        console.log('resProvince: ', resProvince)
        let dataSelectedProvince = this.buildDataInputSelectt(resProvince.data, 'PROVINCE');
        console.log('dataSelectedProvince: ', dataSelectedProvince)
        this.setState({
            listProvince: dataSelectedProvince
        })
    }

    buildDataInputSelectt = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
            }
        }
        return result;

    }


    handleChangeSelectDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        })
    }




    getAllSpecialty = async () => {

        let res = await getAllClinic();

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

    handleSaveNewClinic = async () => {

        let res = await createNewClinic(this.state)
        if (res && res.errCode === 0) {
            toast.success('Thêm cơ sở y tế mới thành công!')
            this.setState({
                name: '',
                imageBase64: '',
                address: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
            })
        } else {
            toast.error('lỗi hệ thống...')
            console.log('>> hoi dan it check res: ', res)
        }
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let { selectedSpecialty } = this.state;

        let temp = {};
        temp.id = selectedOption.value


        let res = await getAllDetailClinicById(temp);
        // if (res && res.errCode === 0 && res.data && res.data.descriptionMarkdown) {

        //     let descriptionMarkdown = res.data.descriptionMarkdown;
        this.setState({
            descriptionMarkdown: res.data.descriptionMarkdown,
            descriptionHTML: res.data.descriptionHTML,
            id: res.data.id,
            name: res.data.name,
            address: res.data.address
        })


    };

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
            selectedSpecialty: '',
            address: ''

        })
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

    handleSaveNewSpecialty = async (type) => {

        if (type == 'add') {
            if (
                !this.state.name
                || !this.state.address
                || !this.state.imageBase64
                || !this.state.selectedProvince
                || !this.state.descriptionHTML
                || !this.state.descriptionMarkdown) {
                toast.error('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            let res = await createNewClinic(this.state);
            if (res && res.errCode === 0) {
                toast.success('Thêm phòng khám thành công!')
                this.setState({
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    address: '',
                    selectedProvince: ''
                })
            } else {
                toast.error('Thêm phòng khám thất bại....')
                console.log('>> hoi dan it check res: ', res)
            }
        }

        if (type == 'edit') {
            if (!this.state.id
                || !this.state.name
                || !this.state.descriptionHTML
                || !this.state.descriptionMarkdown
                || !this.state.address
            ) {
                toast.error('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            let res = await EditClinic(this.state);
            if (res && res.errCode === 0) {
                toast.success('Sửa thông tin phòng khám thành công!')
                this.setState({
                    id: '',
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    selectedSpecialty: '',
                    selectedOption: '',
                    address: '',
                })
            } else {
                toast.error('Sửa thông tin phòng khám thất bại....')
                console.log('>> hoi dan it check res: ', res)
            }
        }

        if (type == 'delete') {
            if (!this.state.id) {
                toast.error('Chưa có phòng khám nào được chọn!');
                return;
            }

            if (!window.confirm("Bạn có thật sự muốn xóa!")) { return; }

            let res = await DeleteClinic(this.state.id);
            if (res && res.errCode === 0) {
                toast.success('Xóa thông tin phòng khám thành công!')
                this.setState({
                    id: '',
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    selectedSpecialty: '',
                    selectedOption: '',
                    address: ''
                })
            } else {
                toast.error('Xóa thông tin phòng khám thất bại....')
                console.log('>> hoi dan it check res: ', res)
            }
        }

        this.getAllSpecialty()

    }




    render() {
        console.log('this.state: ', this.state)
        var { AddSpecialty, listSpecialty } = this.state

        return (
            <div className="manage-specialty-container">
                <div className="ms-title">
                    {AddSpecialty ? 'Thêm phòng khám' : 'Quản lý phòng khám'}
                </div>
                <button className="btn-add-specialty-clone"
                    onClick={() => this.AddSpecialty()}
                >
                    {AddSpecialty ? 'Quản lý phòng khám' : 'Thêm phòng khám'}
                </button>

                {!this.state.AddSpecialty &&

                    <div className="add-new-specialty row">
                        <div className="col-6 form-group">
                            <label>Tên phòng khám</label>
                            <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChangeSelect}
                                options={this.state.listSpecialty}
                                placeholder="Chọn cơ sở y tế"
                            />
                        </div>

                        <div className="col-6 form-group">
                            <label>Ảnh phòng khám</label>
                            <input className="form-control-file" type="file"
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                        </div>

                        <div className="col-6 form-group">
                            <label>Địa chỉ phòng khám</label>
                            <input className="form-control" type="text" value={this.state.address}
                                onChange={(event) => this.handleOnChangeInput(event, 'address')}
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
                        <div className="col-12">
                            {this.state.selectedOption &&
                                < button className="btn-edit-specialty"
                                    onClick={() => this.handleSaveNewSpecialty('edit')}
                                >
                                    Lưu phòng khám
                                </button>
                            }
                            {this.state.selectedOption &&
                                <button className="btn-delete-specialty"
                                    onClick={() => this.handleSaveNewSpecialty('delete')}
                                >
                                    Xóa phòng khám
                                </button>
                            }
                        </div>
                    </div>
                }


                {this.state.AddSpecialty &&

                    <div className="add-new-specialty row">
                        <div className="col-6 form-group">
                            <label>Tên phòng khám</label>
                            <input className="form-control" type="text" value={this.state.name}
                                onChange={(event) => this.handleOnChangeInput(event, 'name')}
                            />
                        </div>



                        <div className="col-6 form-group">
                            <label>Ảnh phòng khám</label>
                            <input className="form-control-file" type="file"
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                        </div>

                        <div className="col-6 form-group">
                            <label>Địa chỉ phòng khám</label>
                            <input className="form-control" type="text" value={this.state.address}
                                onChange={(event) => this.handleOnChangeInput(event, 'address')}
                            />
                        </div>

                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.province" /></label>
                            <Select
                                value={this.state.selectedProvince}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listProvince}
                                placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
                                name="selectedProvince"
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
                        <div className="col-12">
                            <button className="btn-add-specialty"
                                onClick={() => this.handleSaveNewSpecialty('add')}
                            >
                                Thêm phòng khám
                            </button>
                        </div>
                    </div>
                }

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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);