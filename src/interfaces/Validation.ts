export interface Validatable {
       fieldName: string,
       value: string | number,
       minLength?: number,
       maxLength?: number,
       min?: number,
       max?: number
}