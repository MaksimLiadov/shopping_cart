import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import "./OrderBuilder.css";

const OrderBuilder = () => {
  const toast = React.useRef(null);

  const [fieldsForTable, setFieldsForTable] = useState([]);

  const [newFieldName, setNewFieldName] = useState("");
  const [isShowAddFieldDialog, showAddFieldDialog] = useState(false);
  const [isNewFieldNameMatches, setIsNewFieldNameMatches] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/get/orderProcessingColumns"
        );
        const result = await response.json();
        setInitialState(result);
      } catch (error) {
      } finally {
      }
    };

    fetchData();
  }, []);

  const setInitialState = (apiData) => {
    apiData.sort((a, b) => b.required - a.required);
    setFieldsForTable(apiData);
  };

  const handleRemoveField = (field, index) => {
    if (field.required) {
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Нельзя удалить обязательное поле",
        life: 3000,
      });
      return;
    }

    setFieldsForTable((prevFields) => prevFields.filter((_, i) => i !== index));
  };

  const handlerNewFieldNameChange = (value) => {
    if (fieldsForTable.some((field) => field.name === value)) {
      setIsNewFieldNameMatches(true);
    } else {
      setIsNewFieldNameMatches(false);
    }

    setNewFieldName(value);
  };

  const handlerCloseFieldDialog = (isClose) => {
    if (isNewFieldNameMatches) {
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Такое имяя уже занято",
        life: 3000,
      });
      return;
    }

    if (newFieldName.length >= 50) {
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Длина не может быть больше 50 символов",
        life: 3000,
      });
      return;
    }

    let newField = { name: newFieldName, required: false };
    setFieldsForTable((prevFields) => [...prevFields, newField]);

    showAddFieldDialog(!isClose);
  };

  return (
    <div className="order-builder-container">
      <Toast ref={toast} />
      <div className="header">
        Выберите поля объекта, отвечающие за оформление заказа
      </div>
      <div className="field-linking-container">
        <div className="field-linking-values">
          {fieldsForTable.map((field, index) => (
            <div className="value-container" key={index}>
              <span>{field.required ? field.name + "*" : field.name}</span>
              <span
                onClick={() => handleRemoveField(field, index)}
                className="pi pi-times"
                style={{
                  fontSize: "2rem",
                  color: field.required
                    ? "rgba(255, 0, 0, 0.5)"
                    : "rgba(255, 0, 0, 0.726)",
                  cursor: field.required ? "default" : "pointer",
                }}
                disabled={field.required ? true : false}
              ></span>
            </div>
          ))}
        </div>
      </div>
      <div className="order-builder-navigation">
        <Button
          label="Добавить новое поле"
          onClick={() => {
            showAddFieldDialog(true);
            setNewFieldName("");
          }}
        />
        <Link to="/catalog">
          <Button label="Завершить" />
        </Link>
      </div>
      <Dialog
        header="Добавить новое поле"
        visible={isShowAddFieldDialog}
        style={{ width: "40vw" }}
        onHide={() => {
          if (!isShowAddFieldDialog) return;
          showAddFieldDialog(false);
        }}
      >
        <p className="m-0">
          Введите название нового поля.
          <br />
          Максимальная длина 50символов.
        </p>
        <div className="addFieldDialogСontrol">
          <InputText
            value={newFieldName}
            onChange={(e) => handlerNewFieldNameChange(e.target.value)}
          />
          {newFieldName !== "" ? (
            <Button
              label="Сохранить"
              onClick={() => handlerCloseFieldDialog(true)}
            />
          ) : (
            <Button label="Сохранить" disabled />
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default OrderBuilder;
