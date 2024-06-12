import requestTestData from "@data/request.json";
import trainingTestData from "@data/training.json";
import { BaseRequestJson } from "@entities/interface/base.requestJson";
import { RequestSource } from "@libs/requestSource";
import { getDate } from "@utils/random";

export interface GroupTrainingTimeTablesRequestJson {
    group_training_id?: number;
    start_time?: string;
    end_time?: string;
    club_id?: number;
    club_zone_id: number;
    employee_id: number;
    count_seats: number;
    is_repeat?: boolean;
    repeat_rule?: string;
}

export const postGroupTrainingTimeTablesRequestJson = async (startTime?: string,
    endTime?: string, countSeats?: number, groupTrainingId?: number,
    clubId?: number, employee?: number, isRepeat?: boolean, rule?: string
): Promise<BaseRequestJson<GroupTrainingTimeTablesRequestJson>> => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        data: {
            group_training_id: groupTrainingId,
            start_time: startTime != undefined ? startTime : getDate(1, 'T03:00:00Z'),
            end_time: endTime != undefined ? endTime : getDate(1, 'T04:00:00Z'),
            club_id: clubId,
            club_zone_id: trainingTestData.club_zone_id,
            employee_id: employee != undefined ? employee : trainingTestData.employee_id[391],
            count_seats: countSeats != undefined ? countSeats : trainingTestData.count_seats[5],
            is_repeat: isRepeat,
            repeat_rule: rule
        }
    }
};

export interface GetGroupTrainingTimeTablesRequestJson {
    session_id: string;
    request_id: string;
    request_source: string;
    club_id?: number;
    category_id?: any;
    group_training_id?: any;
    employee_id?: any;
    date_from?: string;
    date_to?: string;
}

export const getGroupTrainingTimeTablesRequestJson = async (groupTrainingId: number, clubId?: number, dateFrom?: string): Promise<GetGroupTrainingTimeTablesRequestJson> => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        club_id: clubId,
        category_id: groupTrainingId,
        group_training_id: '',
        employee_id: '',
        date_from: dateFrom != undefined ? dateFrom : trainingTestData.start_time.future,
        date_to: '',

    }
};