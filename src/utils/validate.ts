import {Validatable} from "../interfaces/Validation.js";
import { alertGenerator } from "./alert.js";

export const validate = (input: Validatable) => {
       if(input.value.toString().trim()!=="") {
              if(input.minLength && input.minLength>input.value.toString().trim().length) {
                     document.getElementById(input.fieldName)!.className = "w-100 border border-danger";
                     alertGenerator("Please add a "+input.fieldName+" of length more than 5", "error")
                     return false
              }
              if(input.maxLength && input.maxLength<input.value.toString().trim().length) {
                     document.getElementById(input.fieldName)!.className = "w-100 border border-danger";
                     alertGenerator(input.fieldName +" length can't be more than "+input.maxLength+" letters!", "error")
                     return false
              }
              if(input.max && input.value>input.max) {
                     document.getElementById(input.fieldName)!.className = "w-100 border border-danger";
                     alertGenerator(input.fieldName +" can't be more than "+input.max+"!", "error")
                     return false
              }
              if(input.min && input.value<input.min) {
                     document.getElementById(input.fieldName)!.className = "w-100 border border-danger";
                     alertGenerator(input.fieldName +" length can't be less than "+input.min+"!", "error")
                     return false
              }
              document.getElementById(input.fieldName)!.className = "w-100";
              return true
       } else {
              document.getElementById(input.fieldName)!.className = "w-100 border border-danger";
              alertGenerator("Please add a "+input.fieldName+"!", "error")
              return false
       }
}