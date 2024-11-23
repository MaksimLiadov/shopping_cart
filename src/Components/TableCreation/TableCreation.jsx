import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import "primeicons/primeicons.css";
import * as XLSX from "xlsx";
import "./TableCreation.css";

const TableCreation = () => {
  const [tableTemplateData, setTableTemplateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [userTableOptions, setUserTableOptions] = useState([]);

  const toast = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/database/structure"
        );
        const result = await response.json();
        setTableTemplateData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  let fieldsForTable = ["name", "price", "quantity"];

  const userTableOptionsFill = (fields) => {
    let options = [];
    let counter = 1;

    for (let field in fields[0]) {
      options.push({ label: field, value: counter });
      counter++;
    }

    setUserTableOptions(options);
    console.log(options);
  };

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

        setToastMessage("Файл успешно загружен");
        toast.current.show({
          severity: "success",
          summary: "Успех",
          detail: "Файл успешно загружен",
          life: 3000,
        });

        console.log(jsonData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setFileSelected(false);

      setToastMessage("Файл не загружен");
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

          <label class="input-file">
            <input
              type="file"
              name="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
            <span class="input-file-btn">Выберите файл</span>
          </label>
        </div>

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
