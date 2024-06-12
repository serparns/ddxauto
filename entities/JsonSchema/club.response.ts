import { JSONSchemaType } from "ajv";

export interface ClubDataResponseJson {
    id: number;
    name: string;
    short_name: string;
    symbolic_code: string;
    club_info: object;
    city: object;
    postal_code: string;
    close_period: object;
    open_hours: object;
    photo_url: Array<object>;
    club_urls: Array<object>;
    club_zones: Array<object>;
    area_in_square_meters: number;
    capacity: number;
    is_hidden: boolean;
    offerta_link: string;
}

export const clubDataResponseJsonSchema: JSONSchemaType<ClubDataResponseJson> = {
    type: "object",
    properties: {
        id: { type: "number" },
        name: { type: "string" },
        short_name: { type: "string" },
        symbolic_code: { type: "string" },
        club_info: { type: "object" },
        city: { type: "object" },
        postal_code: { type: "string" },
        close_period: { type: "object" },
        open_hours: { type: "object" },
        photo_url: { type: "array", items: { type: "object" } },
        club_urls: { type: "array", items: { type: "object" } },
        club_zones: { type: "array", items: { type: "object" } },
        area_in_square_meters: { type: "number" },
        capacity: { type: "number" },
        is_hidden: { type: "boolean" },
        offerta_link: { type: "string" },
    },
    required: [
        "id",
        "name",
        "short_name",
        "symbolic_code",
        "club_info",
        "city",
        "close_period",
        "open_hours",
        "photo_url",
        "club_urls",
        "club_zones",
        "area_in_square_meters",
        "capacity",
        "is_hidden",
        "offerta_link"
    ],
}