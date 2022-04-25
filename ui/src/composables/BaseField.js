export function useFieldRules(props) {
  return {
    required: props.required,
    whitespace: !props.allowEmptyWhitespace,
  };
}

export function useInputAttrs(props) {
  return {
    required: props.required,
    type: props.inputType,
  };
}
