import api from "@api";
import { test as BaseTest, mergeTests } from '@playwright/test';
import { HeaderBlock } from 'pages/blocks/headers.blocks';
import { AuthPage } from '../../pages/auth.page';


const test = mergeTests(BaseTest.extend<{
    authPage: AuthPage
    headerBlock: HeaderBlock
}>({
    baseURL: api.urls.base_url_CRM,
    headless: true,
    viewport: { width: 1920, height: 1680 },
    authPage: async ({ }, use) => { await use(new AuthPage()) },
    headerBlock: async ({ }, use) => { await use(new HeaderBlock()) }
}));

export default test;
export const expect = test.expect;