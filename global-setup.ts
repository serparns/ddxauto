import { getBaseParameters } from "@entities/baseParameters";
import { Statuses } from "@libs/statuses";
import { chromium } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import GroupTrainingRequests from "@requests/groupTrainingRequests.request";

async function globalSetup() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const request = page.request;
    const groupTrainingData = (await (await new GroupTrainingRequests(request).getGroupTraining(Statuses.OK, await getBaseParameters())).json()).data[0]

    process.env['CLUB_ID'] = (await (await new ClubsRequests(request).getClubs(Statuses.OK, await getBaseParameters())).json()).data[0].id
    process.env['GROUP_TRAINING_DATA'] = JSON.stringify(groupTrainingData)
}
export default globalSetup;