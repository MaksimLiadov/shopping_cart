import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { addProduct } from '../../../../features/slices/basketSlice'
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import 'primeicons/primeicons.css';
import "./ProductTableActions.css"

const ProductTableActions = (props) => {
    const [amount, setAmount] = useState(0);

    const dispatch = useDispatch();

    const handleAddProduct = () => {
        if (amount != 0) {
            dispatch(addProduct({ product: props.product, amount }));
        }
    };

    function minusOne() {
        if (amount > 0) {
            setAmount(amount - 1);
        }
    }

    function plusOne() {
        if (amount < 100) {
            setAmount(amount + 1);
        }
    }

    return (
        <div className="productTableActionsContainer">
            {/* <Button label="*" /> */}
            <InputNumber className="basketInputNumber" inputId="integeronly" value={amount} onValueChange={(e) => setAmount(e.value)} />
            <Button label="+" onClick={plusOne} />
            <Button label="-" onClick={minusOne} />
            <span onClick={handleAddProduct}><i className="pi pi-cart-plus" style={{ fontSize: '3.5rem' }}></i></span>
        </div>
    );
};

export default ProductTableActions;
