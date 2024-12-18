import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../../../features/slices/basketSlice";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import "primeicons/primeicons.css";
import "./ProductTableActions.css";

const ProductTableActions = (props) => {
  const toast = React.useRef(null);

  const [amount, setAmount] = useState(0);

  const dispatch = useDispatch();

  const handleAddProduct = () => {
    if (amount != 0) {
      dispatch(addProduct({ product: props.product, amount }));
      toast.current.show({
        severity: "success",
        summary: "Успех!",
        detail: `В корзину добавлен ${props.product.name}, ${amount} шт.`,
        life: 3000,
      });
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
      <Toast className="productTableToast" ref={toast} />
      <InputNumber
        className="basketInputNumber"
        inputId="integeronly"
        value={amount}
        onValueChange={(e) => setAmount(e.value)}
      />
      <Button label="+" onClick={plusOne} />
      <Button label="-" onClick={minusOne} />
      <span onClick={handleAddProduct}>
        <i className="pi pi-cart-plus" style={{ fontSize: "3.5rem" }}></i>
      </span>
    </div>
  );
};

export default ProductTableActions;
