import React from "react";
import InputMask from "react-input-mask";
import styles from "./InputField.module.scss";

type InputFieldProps = {
  type: string;
  id: string;
  placeholder?: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  mask?: string;
};

export default function InputField({
  type,
  id,
  placeholder,
  label,
  value,
  onChange,
  mask,
}: InputFieldProps) {
  return (
    <div className={styles["form-group"]}>
      <label htmlFor={id}>{label}</label>
      {mask ? (
        <InputMask
          mask={mask}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        >
          {(inputProps) => <input {...inputProps} type={type} id={id} required />}
        </InputMask>
      ) : (
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
      )}
    </div>
  );
}
