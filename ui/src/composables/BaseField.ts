import type { IPropsBaseField } from "ui/interfaces";

export function useFieldRules(props: IPropsBaseField) {
  return {
    required: props.required,
    whitespace: !props.allowEmptyWhitespace,
  };
}

export function useInputAttrs(props: IPropsBaseField) {
  return {
    required: props.required,
    type: props.inputType,
  };
}
