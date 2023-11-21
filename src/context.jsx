import { useEffect, useReducer, useContext, createContext } from "react";
import reducer from "./Reducer";
import cartItems from "./data";
import { getTotals } from "./utils";

import {
  CLEAR_CART,
  REMOVE,
  INCREASE,
  DECREASE,
  LOADING,
  DISPLAY_ITEMS,
} from "./actions";

const url = "https://www.course-api.com/react-useReducer-cart-project";

const AppContext = createContext();

//setting up the intial status. we set it as an object becasue we can add more properties  to it in the future
const initialState = {
  loading: false,
  cart: new Map(),
};

export const AppProvider = ({ children }) => {
  // useReducer -> is looking for the reducer function responsible for returning the new updated state and for the intialState. What we are getting back? We are getting back state and dispatch. Dispatch is a function that allow us to to dispatch an action and it's gonna get handled in the reducer.
  const [state, dispatch] = useReducer(reducer, initialState);

  const { totalAmount, totalCost } = getTotals(state.cart);

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  const removeItem = (id) => {
    dispatch({ type: REMOVE, payload: { id } });
  };

  const increase = (id) => {
    dispatch({ type: INCREASE, payload: { id } });
  };
  const decrease = (id) => {
    dispatch({ type: DECREASE, payload: { id } });
  };

  const fetchData = async () => {
    dispatch({ type: LOADING });
    const response = await fetch(url);
    const cart = await response.json();
    dispatch({ type: DISPLAY_ITEMS, payload: { cart } });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <AppContext.Provider
      value={{
        ...state,
        clearCart,
        removeItem,
        increase,
        decrease,
        totalAmount,
        totalCost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
