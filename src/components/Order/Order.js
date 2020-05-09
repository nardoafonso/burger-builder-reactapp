import React from 'react';
import classes from './Order.css';

const order = (props)=> {
    let ingredients =[];
    for(let ingredientName in props.ingredients){
        ingredients.push({name:ingredientName,amout:props.ingredients[ingredientName]})
    }

    const ingredientOutput = ingredients.map(ing =>{
        return <span 
                    style={{
                        textTransform:'capitalize',
                        display:'inline-block',
                        margin:'0 8px',
                        border: '1px solid #ccc',
                        padding:'5'
                    }} 
                    key={ing.name} >{ing.name}  ({ing.amout})</span>
    })

    return (
        <div className={classes.Order}>
            <p>Ingridients: {ingredientOutput}</p>
            <p>Price: <strong>{Number.parseFloat(props.price).toFixed(2)}</strong></p>
        </div>
    )
}

export default order;