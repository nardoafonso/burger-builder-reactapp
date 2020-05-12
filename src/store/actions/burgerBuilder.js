import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngridient = (name) =>{
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName:name
    }
}

export const removeIngridient = (name) =>{
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName:name
    }
}

export const setIngredient = (ingredients) =>{
    return {
        type:actionTypes.SET_INGREDIENT,
        ingredients
    }
}
export const fetchIngredientFail = () =>{
    return {
        type:actionTypes.FETCH_INGREDIENT_FAIL
    }
}

export const initIngredients = () =>{
    return dispatch =>{
        axios.get('/ingredients.json').then(response =>{
            dispatch(setIngredient(response.data));
        }).catch(()=>{
            dispatch(fetchIngredientFail());
        });
    }
}
