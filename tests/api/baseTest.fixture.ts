import { test as BaseTest, mergeTests } from '@playwright/test';

const test = mergeTests(BaseTest.extend<{
    clubId: number
    groupTrainingData: any
}>({
    headless: true,

    clubId: Number(process.env.CLUB_ID),
    groupTrainingData: eval('(' + process.env.GROUP_TRAINING_DATA + ')')
}));

export default test;
export const expect = test.expect;  