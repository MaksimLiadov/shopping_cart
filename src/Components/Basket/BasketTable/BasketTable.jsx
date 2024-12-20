import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { removeAllProduct } from "../../../features/slices/basketSlice";
import BasketTableActions from "./BasketTableActions/BasketTableActions";
import "./BasketTable.css";

const BasketTable = () => {
  const basketData = useSelector((state) => state.basket.basketItems);
  const orderBuilder = useSelector((state) => state.catalog.orderBuilder);

  const toast = React.useRef(null);

  let total = basketData
    .reduce((acc, item) => acc + item.productPrice * item.amount, 0)
    .toFixed(2);

  const [isShowOrderingDialog, setIsShowOrderingDialog] = useState(false);

  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState(false);
  const [formValues, setFormValues] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveAllProduct = () => {
    dispatch(removeAllProduct());
    navigate("/", { replace: true });
  };

  const handleInputChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const Purchase = () => {
    if (basketData.length === 0) {
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Корзина пуста.",
        life: 3000,
      });
      return;
    }

    setIsShowOrderingDialog(true);
  };

  const handlerCloseOrderingDialog = (isClose) => {
    const isAllFieldsFilled = orderBuilder.every((field) =>
      field.required ? formValues[field.name] : true
    );
    if (!isAllFieldsFilled) {
      setIsAllFieldsFilled(true);
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Не все поля заполнены",
        life: 3000,
      });
      return;
    }
    
    toast.current.show({
      severity: "success",
      summary: "Успех",
      detail: "Заказ оформлен!",
      life: 3000,
    });
    setIsAllFieldsFilled(false);
    setIsShowOrderingDialog(false);
    dispatch(removeAllProduct());
  };

  return (
    <div className="basket-table-container">
      <Toast className="basketTableToast" ref={toast} />
      <div className="basket-table">
        <DataTable
          className="table"
          value={basketData}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="productName" header="Наименование"></Column>
          <Column field="productPrice" header="Цена"></Column>
          <Column field="amount" header="Количество"></Column>
          <Column
            header="Стоимость"
            body={(rowData) => <BasketTableActions rowData={rowData} />}
          ></Column>
        </DataTable>
        <div className="total-container">
          <span className="total">
            <span>Итого:</span>
            <span>{total}</span>
          </span>
        </div>
      </div>
      <div className="purchase-confirmation-buttons">
        <Button onClick={Purchase} label="Беру!" />
        <Button onClick={handleRemoveAllProduct} label="Пожалуй, откажусь" />
      </div>
      <Dialog
        header="Оформление заказа"
        visible={isShowOrderingDialog}
        style={{ width: "40vw" }}
        onHide={() => {
          if (!isShowOrderingDialog) return;
          setIsShowOrderingDialog(false);
        }}
      >
        <div className="orderFields">
          {orderBuilder.map((field, index) => (
            <div key={index} className="field-container">
              <label htmlFor={field.name}>{field.name}</label>
              <InputText
                id={field.name}
                value={formValues[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="addFieldDialogСontrol">
          {isAllFieldsFilled !== "" ? (
            <Button
              label="Заказать"
              onClick={() => handlerCloseOrderingDialog(true)}
            />
          ) : (
            <Button label="Заказать" disabled />
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default BasketTable;
