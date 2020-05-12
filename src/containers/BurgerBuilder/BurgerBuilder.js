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


class BurgerBuilder extends Component{
    state = {
        // ingredients:null,
        // totalPrice:4,
        // purchasable:false,
        purchasing:false,
        // loading:false,
        // error:false
    }

    updatePurchaseState = (ingredients)=>{
        const sum = Object.keys(ingredients).map(ingKey=>{
            return ingredients[ingKey]
        })
        .reduce((sum,el)=>{
            return sum + el;
        },0);
        // this.setState({purchasable:sum>0});
        return sum > 0;
    }

    // addIngredientHandler = (type) =>{
    //     const oldCount = this.state.ingredients[type];
    //     const updateCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     }
    //     updatedIngredients[type] = updateCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // }

    // removeIngredientHandler = (type) =>{
    //     const oldCount = this.state.ingredients[type];
    //     if(oldCount <=0){
    //         return;
    //     }
    //     const updateCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     }
    //     updatedIngredients[type] = updateCount;
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // }

    puchaseHandler = () => {
        this.setState({purchasing:true});
    }

    purchaseCancelHandler = () =>{
        this.setState({purchasing:false});
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
        // const queryParameter = new URLSearchParams(this.state.ingredients).toString()
        // const totalPrice = new URLSearchParams({price:this.state.totalPrice}).toString();
        // this.props.history.push("/checkout?"+queryParameter);
        this.props.onInitPurchase();
        this.props.history.push({
            pathname:"/checkout",
            // search:queryParameter+"&"+totalPrice
        });
    }

    componentDidMount(){
        this.props.onInitIngredients();
    //     axios.get('/ingredients.json').then(response =>{
    //         this.setState({ingredients:response.data});
    //     }).catch(()=>{
    //         this.setState({error:true});
    //     });
    }

    render(){
        const disabledInfo = {
            // ...this.state.ingredients
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

        // if(this.state.loading){
        //     orderSummary = <Spinner/>
        // } 

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
        price:state.burgerBuilder.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch(actions.addIngridient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngridient(ingredientName)),
        onInitIngredients:() => dispatch(actions.initIngredients()),
        onInitPurchase:()=>{dispatch(actions.purchaseInit())}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));