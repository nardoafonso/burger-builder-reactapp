import * as actionTypes from './actionTypes.js';
import axios from 'axios';

export const authStart = () =>{
    return {
        type:actionTypes.AUTH_START
    }
}


export const authSuccess = (idToken,userId) =>{
    return {
        type:actionTypes.AUTH_SUCCESS,
        idToken,
        userId
    }
}

export const authFail = (error) =>{
    return {
        type:actionTypes.AUTH_FAIL,
        error
    }
}

export const logout = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type:actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) =>{
    return dispatch => {
        setTimeout(()=>{
            dispatch(logout());
        }, expirationTime*1000)
    }
}

export const auth = (email,password, isSignUp) =>{
    return dispatch => {
        dispatch(authStart());
        const authData = {email,password,returnSecureToken:true}
        // do not ever store API KEYS on the client. This app is no published 
        //this is only to make the app work locally
        let url = process.env.REACT_APP_FIREBASE_SIGNUP_URL + process.env.REACT_APP_FIREBASE_API_KEY;
        if(!isSignUp){
            url = process.env.REACT_APP_FIREBASE_SIGNIN_URL + process.env.REACT_APP_FIREBASE_API_KEY;
        }

        axios.post(url,authData)
            .then(response =>{
                localStorage.setItem('token',response.data.idToken);
                localStorage.setItem('expirationDate',new Date(new Date().getTime() + response.data.expiresIn * 1000));
                localStorage.setItem('userId',response.data.localId);
                dispatch(authSuccess(response.data.idToken,response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error));
            });
    }
}

export const setAuthRedirectPath = (path)=>{
    return {
        type:actionTypes.SET_AUTH_REDIRECT_PATH,
        path
    }
}

export const authCheckState = ()=>{
    return dispatch =>{
        const token = localStorage.getItem('token');
        if(!token){
            dispatch(logout());
        }else{
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate > new Date()){
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token,userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
            }else{
                dispatch(logout())
            }
            
        }
        
    }
}