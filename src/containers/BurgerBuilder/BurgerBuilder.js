import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';


export class BurgerBuilder extends Component{
    state = {
        purchasing:false,
    }

    updatePurchaseState = (ingredients)=>{
        const sum = Object.keys(ingredients).map(ingKey=>{
            return ingredients[ingKey]
        })
        .reduce((sum,el)=>{
            return sum + el;
        },0);
        return sum > 0;
    }

    puchaseHandler = () => {
        if(this.props.isAuthenticated){
            this.setState({purchasing:true});
        }else{
            this.props.onSetRedirectAuthPath("/checkout");
            this.props.history.push("/auth");
        }
    }

    purchaseCancelHandler = () =>{
        this.setState({purchasing:false});
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push({
            pathname:"/checkout",
        });
    }

    componentDidMount(){
        this.props.onInitIngredients();
    }

    render(){
        const disabledInfo = {
            ...this.props.ings
        }

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key]<=0;
        }
        
        let orderSummary =  null
        let burger = this.props.error ? <p>Ingredients can be loaded</p> : <Spinner/>

        if(this.props.ings){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        price={this.props.price}
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        disabled={disabledInfo}
                        isAuth={this.props.isAuthenticated}
                        ordered={this.puchaseHandler}
                    />
                </Aux>
            )

            orderSummary =  <OrderSummary 
                price={this.props.price}
                purchaseCancelled={this.purchaseCancelHandler}
                purchasedContinued={this.purchaseContinueHandler}
                ingredients={this.props.ings} />
        }
        
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings:state.burgerBuilder.ingredients,
        error:state.burgerBuilder.error,
        price:state.burgerBuilder.totalPrice,
        isAuthenticated:state.auth.token !==null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch(actions.addIngridient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngridient(ingredientName)),
        onInitIngredients:() => dispatch(actions.initIngredients()),
        onInitPurchase:()=>{dispatch(actions.purchaseInit())},
        onSetRedirectAuthPath:(path)=>{dispatch(actions.setAuthRedirectPath(path))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));