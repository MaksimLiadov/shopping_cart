import React from "react";
import { useDispatch } from 'react-redux';
import { removeProduct } from '../../../../features/slices/basketSlice'
import 'primeicons/primeicons.css';
import "./BasketTableActions.css";

const BasketTableActions = (props) => {
    const dispatch = useDispatch();

    const handleRemoveProduct = () => {
        dispatch(removeProduct(props));
    };

    const cost = (props.rowData.productPrice * props.rowData.amount).toFixed(2);
    return (
        <div className="catalogDataTableContainer">
            {cost}
            <span onClick={handleRemoveProduct} className="cancel"><i className="pi pi-times"></i></span>
        </div >
    );
};

export default BasketTableActions;
