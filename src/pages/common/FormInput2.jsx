import React, { useState } from "react";
import "../../assets/styles/formValidationStyle.css"

const FormInput2 = (props) => {
  const [focused, setFocussed] = useState(false)
  const { label, onChange, keyId, labelclass, wrapperdivclass, noninputtag, error, ...inputProps } = props;

  const handleFocus = () => {
    setFocussed(true);
  };

  return (
    <div className={wrapperdivclass}>
      <label
        htmlFor={inputProps.id}
        className={labelclass}
      >
        {label}
      </label>
      {!noninputtag ? (
        <input {...inputProps} onChange={onChange} onBlur={handleFocus} focused={focused.toString()} />
      ) : (
        noninputtag.type === 'textarea' && (
          <textarea {...inputProps} onChange={onChange} onBlur={handleFocus} focused={focused.toString()}/>
        )
      )
      }
      <span className="span-error p-2">{error}</span>
    </div>
  );
};

export default FormInput2;