import React from "react";
import { useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useFormAndValidation } from "../../utils/hooks/useFormAndValidation";
import Input from "../Input/Input";
import "./RegisterModal.css";

function RegisterModal({
  isOpen,
  onClose,
  submitSuccess,
  isLoading,
  handleRegistration,
  handleLoginButton,
}) {
  const formName = "register";

  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation();

  const onFormSubmit = (evt) => {
    evt.preventDefault();
    handleRegistration(values, formName);
  };

  useEffect(() => {
    if (submitSuccess === true) {
      resetForm();
    }
  }, [submitSuccess]);

  return (
    <ModalWithForm
      buttonText="Sign Up"
      loadingButtonText="Signing Up..."
      isLoading={isLoading}
      title="Sign Up"
      isOpen={isOpen}
      onClose={onClose}
      onFormSubmit={onFormSubmit}
      isValid={isValid}
      formName={formName}
    >
      <Input
        id="register-email"
        errors={errors.email}
        labelText="Email*"
        preErrorMsgTxt=" "
        inputName="email"
        type="email"
        placeholder="Email"
        values={values.email}
        handleChange={handleChange}
      />
      <Input
        id="register-password"
        errors={errors.password}
        labelText="Password*"
        preErrorMsgTxt=" "
        inputName="password"
        type="password"
        placeholder="Password"
        values={values.password}
        handleChange={handleChange}
      />
      <Input
        id="register-name"
        errors={errors.name}
        labelText="Name*"
        preErrorMsgTxt=" "
        inputName="name"
        type="text"
        placeholder="Name"
        values={values.name}
        handleChange={handleChange}
        minLength="2"
        maxLength="30"
      />
      <Input
        id="register-avatar"
        errors={errors.avatar}
        labelText="Avatar*"
        preErrorMsgTxt=" "
        inputName="avatar"
        type="url"
        placeholder="Avatar"
        values={values.avatar}
        handleChange={handleChange}
      />
      <button
        onClick={handleLoginButton}
        className={`${
          isLoading === false
            ? "modal__login_nav-register-modal"
            : "modal__login_nav-register-modal_load"
        }`}
        type="button"
      >
        or Log In
      </button>
    </ModalWithForm>
  );
}

export default RegisterModal;
