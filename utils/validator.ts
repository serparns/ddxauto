import Ajv from "ajv";
import {log} from "@utils/logger";

export async function validatorJson (schema: any, json: JSON | any): Promise<boolean> {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    log('expected response schema', schema);

    if (validate(json)) {
        console.log("\n RESPONSE SUCCESSFULLY VALIDATED")
        return true;
    }
    else {
        console.log(validate.errors)
        throw new Error("RESPONSE DIDN'T VALIDATE").message;
    }
}