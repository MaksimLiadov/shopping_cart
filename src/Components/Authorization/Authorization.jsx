import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import "./Authorization.css";

const Authorization = () => {
  const toast = React.useRef(null);

  return (
    <div className="authorization-container">
      <header>header</header>
      <div className="enter-user-name">
        <FloatLabel>
          <InputText
            id="username"
          />
          <label htmlFor="username">Имя пользователя</label>
        </FloatLabel>
        <small id="username-help">Введите имя пользователя.</small>
      </div>
      <div className="enter-user-password">
        <FloatLabel>
          <InputText
            id="password"
          />
          <label htmlFor="password">Пароль</label>
        </FloatLabel>
        <small id="username-help">Введите пароль.</small>
      </div>
      <Button  label="Войти" />
    </div>
  );
};

export default Authorization;
