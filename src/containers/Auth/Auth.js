import React, {Component} from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';
class Auth extends Component {

    componentDidMount(){
        if(!this.props.building && this.props.authRedirect !=="/"){
            this.props.onSetRedirectAuthPath();
        }
    }

    state = {
        controls:{
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
        },
        isSignUp:true
    }

    inputChangeHandler = (event, ctrlName)=>{
        const updateControls = updateObject(this.state.controls,{
            [ctrlName]: updateObject(this.state.controls[ctrlName], { 
                value:event.target.value,
                valid:checkValidity(event.target.value,this.state.controls[ctrlName].validation),
                touched:true}
            )});
        this.setState({controls: updateControls});
    }

    submitHandler = (event)=>{
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value,this.state.isSignUp);
    }

    switchAuthModeHandler = ()=>{
        this.setState(prevState =>{
            return {isSignUp:!prevState.isSignUp};
        })
    }


    render(){
        const formElementsArray = [];
        for (let key in this.state.controls){
            formElementsArray.push({
                id:key,
                config:this.state.controls[key]
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
                changed={(event)=>{this.inputChangeHandler(event,formEl.id)}} />
             
        ))

        if(this.props.loading){
            form = <Spinner />
        }

        let errorMessage = null;

        if(this.props.error){
            errorMessage = <p>{this.props.error.message}</p>
        }

        let authRedirect = null
        if(this.props.isAuthenticated){
            authRedirect = <Redirect to={this.props.authRedirect}/>
        }

        return (
            <div className={classes.Auth}>
                {errorMessage}
                {authRedirect}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Primary">Submit</Button>
                </form>
                <Button 
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">
                        Switch to {this.state.isSignUp ? 'Sign In' : 'Sign Up'} 
                </Button>
            </div>
        );
    }
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

export default connect(mapStateToProps,mapDispatchToProps)(Auth);