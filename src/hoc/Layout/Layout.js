
import React, {useState} from 'react';
import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {connect} from 'react-redux';

const layout = props => {
    const [sideDrawer, setSideDrawerState] = useState(false);

    const sideDrawerCloseHandler = () =>{
        setSideDrawerState(false);
    }

    const sideDrawerToggleHandler = () =>{
        setSideDrawerState(!sideDrawer);
    }


    return ( 
        <Aux>
            <Toolbar isAuth={props.isAuthenticated} drawerToggleClicked={sideDrawerToggleHandler}/>
            <SideDrawer 
                isAuth={props.isAuthenticated}
                open={sideDrawer} 
                closed={sideDrawerCloseHandler} />
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    )
  
}

const mapStateToProps = state =>{
    return {
        isAuthenticated : state.auth.token !== null
    }
}

export default connect(mapStateToProps)(layout);