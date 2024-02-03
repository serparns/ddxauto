export interface BaseRequestJson <T>{
    session_id: string;
    request_id: string;
    request_source: string;
    data?: object;
}