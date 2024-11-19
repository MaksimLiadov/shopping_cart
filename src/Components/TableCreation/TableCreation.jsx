import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "./TableCreation.css";

const TableCreation = () => {
  let fieldsForTable = ["name", "price", "quantity"];

  const userTableOptions = [
    { label: "Price", value: 1 },
    { label: "Name", value: 2 },
    { label: "Quantity", value: 3 },
  ];

  const tableTemplateOptions = [
    { label: "Продукты", value: 1 },
    { label: "Мебель", value: 2 },
    { label: "ПК", value: 3 },
  ];

  const initialState = fieldsForTable.reduce((acc, field) => {
    acc[field] = null;
    return acc;
  }, {});

  const [selectedFields, setSelectedFields] = useState(initialState);
  const [selectedTableTemplate, setSelectedTableTemplate] = useState(null);

  const handleDropdownChange = (field, value) => {
    setSelectedFields((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <div className="table-creation-container">
      <div className="toolbar">
        <Button label="Загрузить таблицу из Excel" />
        <div className="table-template-selection">
          <Dropdown
            value={selectedTableTemplate}
            placeholder={`Выберите шаблон таблицы`}
            options={tableTemplateOptions}
            editable
            onChange={(e) => setSelectedTableTemplate(e.value)}
          />
        </div>
      </div>
      <div className="field-linking-container">
        <div className="center-text">Поля из таблицы пользователя</div>
        <div className="center-text">Поле в шаблоне</div>
        <div>
          {fieldsForTable.map((field) => (
            <div className="dropdown-container">
              <Dropdown
                id={field}
                value={selectedFields[field]}
                placeholder={`Выберите поле для ${field}`}
                options={userTableOptions}
                editable
                onChange={(e) => handleDropdownChange(field, e.value)}
              />
            </div>
          ))}
        </div>
        <div className="dropdown-label-container">
          {fieldsForTable.map((field, index) => (
            <div key={index}>
              <span>{field}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableCreation;
