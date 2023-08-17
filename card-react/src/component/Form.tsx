import React, { FC, useRef, useState } from "react";
import "../App.css";

type FormProps = {
  onHandleDisplayCards: (num: number) => void;
  disabledBtn?: boolean;
};

const validateInput = (numberOfUser: any) => {
  if (!numberOfUser || isNaN(numberOfUser) || parseInt(numberOfUser) <= 0) {
    return false;
  }
  return true;
};

const Form: FC<FormProps> = (props) => {
  const { onHandleDisplayCards, disabledBtn } = props;
  const ref = useRef<string>();
  const [error, setError] = useState<string>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(undefined);
    ref.current = e.target.value;
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidInput = validateInput(ref.current);
    if (!isValidInput) {
      setError("Only positive numerical number allowed!");
      return;
    }
    onHandleDisplayCards(parseInt(ref.current!));
  };

  return (
    <div className="form__wrapper">
      <form onSubmit={handleFormSubmit}>
        Please enter a number:
        <input
          disabled={disabledBtn}
          name="numberOfUser"
          className="input"
          onChange={handleInputChange}
        />
        <div className="helper-text">{error}</div>
        <button disabled={disabledBtn} type="submit" className="button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
