export interface FormField {
  label: string,
  code: string,
  field: FieldType,
  hasError: boolean,
  error?: string,
  options?: Option[],
  multiOptions?: OptionGroup[],
  disabled?: boolean,
  multiple?: boolean
}

export enum FieldType {
  input,
  select,
  email,
  number,
  checkbox,

}

export interface Option {
  value: string | number,
  label: string
}

export interface OptionGroup {
  name: string,
  disabled?: boolean,
  options: Option[]
}
