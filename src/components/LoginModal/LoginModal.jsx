import React from "react";
import { useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useFormAndValidation } from "../../utils/hooks/useFormAndValidation";
import Input from "../Input/Input";
import "./LoginModal.css";

function LoginModal({
  isOpen,
  onClose,
  submitSuccess,
  isLoading,
  handleLogin,
  handleSignupButton,
}) {
  const formName = "log-in";

  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation();

  const onFormSubmit = (evt) => {
    evt.preventDefault();
    handleLogin(values, formName);
  };

  useEffect(() => {
    if (submitSuccess === true) {
      resetForm();
    }
  }, [submitSuccess]);

  return (
    <ModalWithForm
      buttonText="Log In"
      loadingButtonText="Logging In..."
      isLoading={isLoading}
      title="Log In"
      isOpen={isOpen}
      onClose={onClose}
      onFormSubmit={onFormSubmit}
      isValid={isValid}
      formName={formName}
    >
      <Input
        id="login-email"
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
        id="login-password"
        errors={errors.password}
        labelText="Password*"
        preErrorMsgTxt=" "
        inputName="password"
        type="password"
        placeholder="Password"
        values={values.password}
        handleChange={handleChange}
      />
      <button
        onClick={handleSignupButton}
        className={`${
          isLoading === false
            ? "modal__signup_nav-login-modal"
            : "modal__signup_nav-login-modal_load"
        }`}
        type="button"
      >
        or Sign up
      </button>
    </ModalWithForm>
  );
}

export default LoginModal;
