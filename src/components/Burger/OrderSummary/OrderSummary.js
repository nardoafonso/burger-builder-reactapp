import React, {Component} from 'react';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../UI/Button/Button';

//May be a function component
class OrderSummary extends Component{
  render(){
    const ingredientsSummary = Object.keys(this.props.ingredients)
    .map(ingKey =>{
        return (
            <li key={ingKey}> 
                <span style={{textTransform:'capitalize'}}>{ingKey}</span>:{this.props.ingredients[ingKey]}
            </li>);             
    });

    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A burguer with :</p>
            <ul>
                {ingredientsSummary}
            </ul>
            <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
            <p>Cotinue to Checkout?</p>
            <Button btnType="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
            <Button btnType="Success" clicked={this.props.purchasedContinued}>CONTINUE</Button>
        </Aux>
    );
  }
}

export default OrderSummary;