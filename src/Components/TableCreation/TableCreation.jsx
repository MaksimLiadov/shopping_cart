import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import * as XLSX from "xlsx";
import "./TableCreation.css";

const TableCreation = () => {
  const [tableTemplateData, setTableTemplateData] = useState();
  const [tableTemplateOptions, setTableTemplateOptions] = useState([]);
  const [selectedTableTemplate, setSelectedTableTemplate] = useState(1);

  const [userTableOptions, setUserTableOptions] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  const [fieldsForTable, setFieldsForTable] = useState([]);
  const [allFieldsForTableFilled, setAllFieldsForTableFilled] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [excelData, setExcelData] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);

  const toast = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/get/tablesTemplates"
        );
        const result = await response.json();
        setTableTemplateData(result);
        setInitialState(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //Проверка получения данных пользователя
  const userData = useSelector((state) => state.user.user);

  const setInitialState = (result) => {
    //Проверка получения данных пользователя
    console.log(userData);

    //Загрузка начальной таблицы
    let comparedFields = [];

    const templateKeys = Object.keys(result);
    const selectedTemplateKey = templateKeys[0];
    comparedFields = result[selectedTemplateKey];

    setFieldsForTable(comparedFields);

    //Загрузка значений для Dropdown с выбором шаблона
    let tablesTemplatesNames = [];
    let counter = 1;

    for (let field in result) {
      tablesTemplatesNames.push({ label: field, value: counter });
      counter++;
    }

    setTableTemplateOptions(tablesTemplatesNames);

    setTableTemplateData(result);
  };

  const userTableOptionsFill = (fields) => {
    let options = [];
    let counter = 1;

    for (let field in fields[0]) {
      options.push({ label: field, value: counter });
      counter++;
    }

    setUserTableOptions(options);
  };

  const handleDropdownTableTemplateChange = (selectedTemplateNumber) => {
    let comparedFields = [];

    const templateKeys = Object.keys(tableTemplateData);
    const selectedTemplateKey = templateKeys[selectedTemplateNumber - 1];
    comparedFields = tableTemplateData[selectedTemplateKey];

    setSelectedFields([]);
    setFieldsForTable(comparedFields);
    setSelectedTableTemplate(selectedTemplateNumber);
  };

  const handleСomparisonFieldChange = (field, value) => {
    setSelectedFields((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  useEffect(() => {
    let selectedFieldsLength = 0;
    for (let field in selectedFields) {
      selectedFieldsLength++;
    }

    const allFilled =
      selectedFieldsLength === fieldsForTable.length &&
      selectedFieldsLength > 0;

    setAllFieldsForTableFilled(allFilled);
  }, [selectedFields, fieldsForTable]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setExcelData(jsonData);
        setFileSelected(true);
        userTableOptionsFill(jsonData);

        toast.current.show({
          severity: "success",
          summary: "Успех",
          detail: "Файл успешно загружен",
          life: 3000,
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      if (excelData) {
        toast.current.show({
          severity: "error",
          summary: "Ошибка",
          detail: "Не удалось загрузить новый файл",
          life: 3000,
        });

        return;
      }

      setFileSelected(false);

      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Файл не был загружен",
        life: 3000,
      });
    }
  };

  return (
    <div className="table-creation-container">
      <Toast ref={toast} />
      <div className="toolbar">
        <div>
          {fileSelected ? (
            <i
              className="pi pi-check icon"
              style={{ color: "green", marginLeft: "10px" }}
            ></i>
          ) : (
            <i
              className="pi pi-times icon"
              style={{ color: "red", marginLeft: "10px" }}
            ></i>
          )}

          <label className="input-file">
            <input
              type="file"
              name="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
            <span className="input-file-btn">Выберите файл</span>
          </label>
        </div>

        <div className="table-template-selection">
          <Dropdown
            value={selectedTableTemplate}
            placeholder={`Выберите шаблон таблицы`}
            options={tableTemplateOptions}
            onChange={(e) => handleDropdownTableTemplateChange(e.value)}
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
                value={selectedFields[field]}
                placeholder={`Выберите поле для ${field}`}
                options={userTableOptions}
                onChange={(e) => handleСomparisonFieldChange(field, e.value)}
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
      <div className="table-creation-navigation">
        {fileSelected && allFieldsForTableFilled ? (
          <Link to="/orderBuilder">
            <Button label="Далее" />
          </Link>
        ) : (
          <Button label="Далее" disabled />
        )}
      </div>
    </div>
  );
};

export default TableCreation;
