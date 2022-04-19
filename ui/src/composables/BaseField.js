export function useFieldCls(props) {
  const { labelAlign } = props;
  return {
    "flex-col label-vertical": labelAlign === "top",
    "flex-row-reverse label-horizontal": labelAlign === "right",
    "flex-col-reverse label-vertical": labelAlign === "bottom",
    "flex-row label-horizontal": labelAlign === "left",
  };
}

export function useFieldRules(props) {
  return {
    required: props.required,
    whitespace: !props.allowEmptyWhitespace,
  };
}

export function useInputCls(props, field) {
  const inputCls = {
    "field-invalid": field.meta.touched && field.meta.valid === false,
  };
  if (props.inputWrapperClasses) {
    inputCls[props.inputWrapperClasses] = true;
  }
  return inputCls;
}

export function useInputAttrs(props) {
  return {
    required: props.required,
    type: props.inputType,
  };
}
