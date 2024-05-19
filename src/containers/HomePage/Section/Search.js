import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { withRouter } from 'react-router'
import './Search.scss';

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    RedirectClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    render() {
        var { clickSearch, filteredEmails } = this.props
        return (
            <>
                {clickSearch && clickSearch === true &&
                    <div className='search-result'>
                        {filteredEmails.map((item, index) => {
                            if(index < 3) {
                                return (
                                    <div className="mail search-clinic" key={item.id}>
                                        <div className="from" onClick={() => this.RedirectClinic(item)}>{item.name}</div>
                                    </div>
                                )
                            }

                        })}
                    </div>
                }
            </>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search));