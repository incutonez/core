import type { IPropsBaseField } from "ui/interfaces";

// TODO: Should probably use a Guid or something in the future
let uniqueId = 1;

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

export function useUniqueId() {
  return uniqueId++;
}
