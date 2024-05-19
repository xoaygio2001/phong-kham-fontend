import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageHandbook from '../containers/System/handbook/ManageHandbook';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageComment from '../containers/System/Comment/ManageComment';


class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            
                            {/* <Route path="/system/user-manage" component={UserManage} /> */}
                            <Route path="/system/manage-clinic" component={ManageClinic} />
                            <Route path="/system/user-redux" component={UserRedux} />
                            <Route path="/system/manage-doctor" component={ManageDoctor} />
                            <Route path="/system/manage-handbook" component={ManageHandbook} />
                            <Route path="/system/manage-specialty" component={ManageSpecialty} />
                            <Route path="/system/manage-comment" component={ManageComment} />


                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
