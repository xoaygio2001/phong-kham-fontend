import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { emitter } from '../../utils/emitter';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
        }

        this.listenToEmitter();

    }

    async componentDidMount() {

    }

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnChangeInput = (event, id) => {
        let tmpState = this.state;
        tmpState[id] = event.target.value;
        this.setState({
            ...tmpState
        });
    }

    checkValidate = (data) => {
        let flag = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                alert("Null: " + arrInput[i]);
                flag = false;
                break;
            }
        }
        if (flag) {
            this.props.createNewUser(this.state);
        }
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: ''
            })
        })
    }

    render() {
        return (
            <Modal isOpen={this.props.isShowModal} toggle={() => this.toggle()} className="UserModal">
                <ModalHeader className="modal-header" toggle={() => this.toggle()}>Create a new user</ModalHeader>
                <ModalBody>
                    <div className="model-user-body">
                        <div className="input-container">
                            <label>Email</label>
                            <input
                                value={this.state.email}
                                onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                type="text"
                            />
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                            <input
                                value={this.state.password}
                                onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                type="text"
                            />
                        </div>
                        <div className="input-container">
                            <label>First name</label>
                            <input
                                value={this.state.firstName}
                                onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                type="text"
                            />
                        </div>
                        <div className="input-container">
                            <label>Last name</label>
                            <input
                                value={this.state.lastName}
                                onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                type="text"
                            />
                        </div>
                        <div className="input-container max-width-input">
                            <label>Address</label>
                            <input
                                value={this.state.address}
                                onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                type="text"
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={() => this.checkValidate()}
                        className="px-2"
                        color="primary">Save changes
                    </Button>{' '}
                    <Button className="px-2" color="secondary" onClick={() => this.toggle()}>Cancel</Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
