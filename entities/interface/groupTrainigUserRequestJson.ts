import requestTestData from "@data/request.json";
import { RequestSource } from "@libs/requestSource";

export interface PostGroupTrainingUsersRequestJson {
    session_id: string;
    request_id: string;
    request_source: string;
    group_training_time_table_id?: number;
    user_id: number;
    booking_status: string;
}

export const postGroupTrainingUsersRequestJson = async (groupTrainingId: number, userId: number): Promise<PostGroupTrainingUsersRequestJson> => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        group_training_time_table_id: groupTrainingId,
        user_id: userId,
        booking_status: "booked"
    }
};