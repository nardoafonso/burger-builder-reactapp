import React, {useState, useEffect} from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';

const auth = props =>{
    const {authRedirect,building,onSetRedirectAuthPath} = props;

    useEffect(()=>{
        if(!building && authRedirect !=="/"){
            onSetRedirectAuthPath();
        }
    },[authRedirect,building,onSetRedirectAuthPath]);

    const [authForm,setAuthForm] =  useState({
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail:true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength:6
                },
                valid: false,
                touched: false
            }
        });

    const [isSignUp,setIsSignUp] = useState(true);

    const inputChangeHandler = (event, ctrlName)=>{
        const updateControls = updateObject(authForm,{
            [ctrlName]: updateObject(authForm[ctrlName], { 
                value:event.target.value,
                valid:checkValidity(event.target.value,authForm[ctrlName].validation),
                touched:true}
            )});
        setAuthForm(updateControls);
    }

    const submitHandler = (event)=>{
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value,isSignUp);
    }

    const switchAuthModeHandler = ()=>{
      setIsSignUp(!isSignUp);
    }


    const formElementsArray = [];
    for (let key in authForm){
        formElementsArray.push({
            id:key,
            config:authForm[key]
        })
    }

    let form = formElementsArray.map(formEl => (
        <Input 
            key={formEl.id}
            elementType={formEl.config.elementType} 
            elementConfig={formEl.config.elementConfig} 
            value={formEl.config.value}
            invalid={!formEl.config.valid}
            shouldValidate={formEl.config.validation}
            touched={formEl.config.touched}
            changed={(event)=>{inputChangeHandler(event,formEl.id)}} />
            
    ))

    if(props.loading){
        form = <Spinner />
    }

    let errorMessage = null;

    if(props.error){
        errorMessage = <p>{props.error.message}</p>
    }

    let authRedirectComp = null
    if(props.isAuthenticated){
        authRedirectComp = <Redirect to={props.authRedirect}/>
    }

    return (
        <div className={classes.Auth}>
            {errorMessage}
            {authRedirectComp}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType="Primary">Submit</Button>
            </form>
            <Button 
                clicked={switchAuthModeHandler}
                btnType="Danger">
                    Switch to {isSignUp ? 'Sign In' : 'Sign Up'} 
            </Button>
        </div>
    );
}

const mapStateToProps = state =>{
    return {
        loading:state.auth.loading,
        error:state.auth.error,
        isAuthenticated:state.auth.token !== null,
        building:state.burgerBuilder.building,
        authRedirect:state.auth.authRedirect
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        onAuth:(email,password,isSignUp)=> dispatch(actions.auth(email,password,isSignUp)),
        onSetRedirectAuthPath:()=>{dispatch(actions.setAuthRedirectPath("/"))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(auth);