import { useContext, useEffect } from "react";
import "./Form.css";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Form({
  formName,
  title,
  onFormSubmit,
  isValid,
  isLoading,
  loadingButtonText,
  buttonText,
  children,
}) {
  const { formError } = useContext(CurrentUserContext);

  useEffect(() => {
    console.log(formError), [formError];
  });

  return (
    <>
      <h2 className="form__title">{title}</h2>
      <form
        action=""
        autoComplete="on"
        className="form__element"
        onSubmit={onFormSubmit}
      >
        {children}
        <button className="form__submit" type="submit" disabled={!isValid}>
          {`${isLoading === true ? `${loadingButtonText}` : `${buttonText}`}`}
        </button>
        <p className="form__error">{formError[formName]}</p>
      </form>
    </>
  );
}

export default Form;
