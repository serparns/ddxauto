import {BaseRequestJson} from "@entities/interface/base.requestJson";
import requestTestData from "@data/request.json";
import {RequestSource} from "@libs/requestSource";
import trainingTestData from "@data/training.json";


export interface GroupTrainingTimeTablesRequestJson {
    group_training_id: number;
    start_time: string;
    end_time: string;
    club_id: number;
    club_zone_id: number;
    employee_id: number;
    count_seats: number;
    is_repeat: boolean;
    repeat_rule: string;
}


export const postGroupTrainingTimeTablesRequestJson = async (groupTrainingId: number,
                                                             club_id: number, startTime: string,
                                                             endTime: string, countSeats: number, isRepeat: boolean, repeatRule?: string
): Promise<BaseRequestJson<GroupTrainingTimeTablesRequestJson>> => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        data: {
            group_training_id: groupTrainingId,
            start_time: startTime,
            end_time: endTime,
            club_id: club_id,
            club_zone_id: trainingTestData.club_zone_id,
            employee_id: trainingTestData.employee_id,
            count_seats: countSeats,
            is_repeat: isRepeat,
            repeat_rule: repeatRule != undefined ? repeatRule : ''
        }
    }
};