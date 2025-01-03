import React from "react";
import InputMask from "react-input-mask";
import styles from "./InputFieldForm.module.scss";

type InputFieldFormProps = {
  type: string;
  id: string;
  placeholder?: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  mask?: string;
};

export default function InputFieldForm({
  type,
  id,
  placeholder,
  label,
  value,
  onChange,
  mask,
}: InputFieldFormProps) {
  return (
    <label className={styles["input-form"]}>
      {label}
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
    </label>
  );
}
