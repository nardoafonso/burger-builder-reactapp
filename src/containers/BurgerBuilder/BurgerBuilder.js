import React, {useState, useEffect, useCallback} from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {useDispatch , useSelector} from 'react-redux';
import * as actions from '../../store/actions/index';


const burgerBuilder = props =>{
    const [purchasing,setPurchasing] = useState(false)

    const dispatch = useDispatch();

    const error = useSelector(state =>state.burgerBuilder.error);
    const ings = useSelector(state =>state.burgerBuilder.ingredients);
    const price = useSelector(state => state.burgerBuilder.totalPrice );
    const isAuthenticated = useSelector(state => state.auth.token !==null );

    const onIngredientAdded = (ingredientName) => dispatch(actions.addIngridient(ingredientName))
    const onIngredientRemoved = (ingredientName) => dispatch(actions.removeIngridient(ingredientName))
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()),[]);
    const onInitPurchase = ()=>{dispatch(actions.purchaseInit())}
    const onSetRedirectAuthPath= (path)=>{dispatch(actions.setAuthRedirectPath(path))}

    const updatePurchaseState = (ingredients)=>{
        const sum = Object.keys(ingredients).map(ingKey=>{
            return ingredients[ingKey]
        })
        .reduce((sum,el)=>{
            return sum + el;
        },0);
        return sum > 0;
    }

    const puchaseHandler = () => {
        if(isAuthenticated){
            setPurchasing(true);
        }else{
            onSetRedirectAuthPath("/checkout");
            props.history.push("/auth");
        }
    }

    const purchaseCancelHandler = () =>{
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push({
            pathname:"/checkout",
        });
    }

    useEffect(()=>{
        onInitIngredients();
    },[onInitIngredients])

    const disabledInfo = {
        ...ings
    }

    for(let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key]<=0;
    }
    
    let orderSummary =  null
    let burger = error ? <p>Ingredients can be loaded</p> : <Spinner/>

    if(ings){
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls
                    price={price}
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    purchasable={updatePurchaseState(ings)}
                    disabled={disabledInfo}
                    isAuth={isAuthenticated}
                    ordered={puchaseHandler}
                />
            </Aux>
        )

        orderSummary =  <OrderSummary 
            price={price}
            purchaseCancelled={purchaseCancelHandler}
            purchasedContinued={purchaseContinueHandler}
            ingredients={ings} />
    }
    
    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
}

// const mapStateToProps = state => {
//     return {
//         ings:state.burgerBuilder.ingredients,
//         error:state.burgerBuilder.error,
//         price:state.burgerBuilder.totalPrice,
//         isAuthenticated:state.auth.token !==null
//     }
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         onIngredientAdded: (ingredientName) => dispatch(actions.addIngridient(ingredientName)),
//         onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngridient(ingredientName)),
//         onInitIngredients:() => dispatch(actions.initIngredients()),
//         onInitPurchase:()=>{dispatch(actions.purchaseInit())},
//         onSetRedirectAuthPath:(path)=>{dispatch(actions.setAuthRedirectPath(path))}
//     }
// }

export default withErrorHandler(burgerBuilder,axios);