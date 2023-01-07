import validator from "validator"


export const sanitizeString = (target: string): string => {
    let safe = validator.escape(target);
    safe = validator.stripLow(target);
    return safe;
}