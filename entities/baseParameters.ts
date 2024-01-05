export async function getBaseParameters(): Promise<object> {
    return {           
        session_id: "345",
        request_id: "345",
        request_source: "crm",
    }
}
export async function getBaseFalseParameters(): Promise<object> {
    return {           
        request_id: "345",
        request_source: "crm",
    }
}