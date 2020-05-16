import React, {Component} from 'react';
import * as actions from '../../../store/actions/index';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

class Logout extends Component {
   
    componentDidMount(){
        this.props.onLogout();
    }

    render(){
        return (
            <Redirect to="/"/>
        );
    }
}

const mapStateToProps = state =>{
    return {
        loading:state.auth.loading,
        error:state.auth.error
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        onLogout:()=> dispatch(actions.logout()),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Logout);