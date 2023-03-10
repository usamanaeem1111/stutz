import React from "react";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function InputField({ label, name, value, onChange, placeholder }: Props) {
  return (
    <div className="mt-1">
      <label htmlFor={name} className="text-lg text-[#656565]">
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border-2 border-[#E2E2E2] p-2 rounded-3xl w-full mt-1 text-right m-1"
      />
    </div>
  );
}

export default InputField;
