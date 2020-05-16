import React from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route,Redirect} from 'react-router-dom';
import ContactData from '../Checkout/ContactData/ContactData';
import {connect} from 'react-redux';

const checkout = props => {

    const checkoutCancelledHandler = ()=>{
        props.history.goBack();
    }
    const checkoutContinuedHandler = ()=>{
        props.history.replace('/checkout/contact-data');
    }

  
    let summary = <Redirect to="/"/>
    const purchasedRedirect = props.purchased ? <Redirect to="/" /> : null;
    if(props.ings){
        summary = (
            <div>
                {purchasedRedirect}
                <CheckoutSummary 
                    ingredients={props.ings}
                    checkoutCancelled={checkoutCancelledHandler}
                    checkoutContinued={checkoutContinuedHandler}/>
                <Route path={props.match.path + '/contact-data'} component={ContactData}/>
            </div>
        );
        
    }
    return summary;
}

const mapStateToProps = state =>{
    return {
        ings:state.burgerBuilder.ingredients,
        purchased:state.order.purchased
    }
}

export default connect(mapStateToProps)(checkout);