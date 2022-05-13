import { alertGenerator } from "./alert.js";
export const validate = (input) => {
    if (input.value.toString().trim() !== "") {
        if (input.minLength && input.minLength > input.value.toString().trim().length) {
            alertGenerator("Please add a " + input.fieldName + " of length more than 5", "error");
            return false;
        }
        if (input.maxLength && input.maxLength < input.value.toString().trim().length) {
            alertGenerator(input.fieldName + " length can't be more than " + input.maxLength + " letters!", "error");
            return false;
        }
        if (input.max && input.value > input.max) {
            alertGenerator(input.fieldName + " can't be more than " + input.max + "!", "error");
            return false;
        }
        if (input.min && input.value < input.min) {
            alertGenerator(input.fieldName + " length can't be less than " + input.min + "!", "error");
            return false;
        }
        return true;
    }
    else {
        alertGenerator("Please add a " + input.fieldName + "!", "error");
        return false;
    }
};
//# sourceMappingURL=validate.js.map