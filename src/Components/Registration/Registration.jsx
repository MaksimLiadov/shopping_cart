import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import "./Registration.css";

const Registration = () => {
  const toast = React.useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fio, setFio] = useState("");

  const [error, setError] = useState();
  const [loading, setLoading] = useState("");

  const registration = () => {
    if (!username) {
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Имя пользователя не может быть пустым",
        life: 3000,
      });
      return;
    }

    if (!password) {
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Пароль не может быть пустым",
        life: 3000,
      });
      return;
    }

    if (!fio) {
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "ФИО не может быть пустым",
        life: 3000,
      });
      return;
    }

    fetchData({ username: username, password: password, name: fio });
  };

  const fetchData = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      } else {
        dispatch(setUser(result.user));
        navigate("/tableCreation");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: error.message,
        life: 3000,
      });
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-page">
      <Toast ref={toast} />
      <div className="authorization-container">
        <header>Регистрация</header>
        <div className="input-data">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              value={fio}
              onChange={(e) => setFio(e.target.value)}
              placeholder="ФИО"
              maxLength={40}
            />
          </div>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Логин"
              maxLength={40}
            />
          </div>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock"></i>
            </span>
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              maxLength={40}
            />
          </div>
        </div>
        <div className="buttons">
          <Link to="/">
            <Button label="Авторизация" />
          </Link>
          <Button onClick={registration} label="Регистрация" />
        </div>
      </div>
    </div>
  );
};

export default Registration;
