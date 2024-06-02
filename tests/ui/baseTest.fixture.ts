import api from "@api";
import { AnalyticsPage } from "@pages/analytics.page";
import { AuthPage } from '@pages/auth.page';
import { HeaderBlock } from "@pages/blocks/headers.blocks";
import { MenuBlock } from "@pages/blocks/menu.blocks";
import { ClientPage } from "@pages/client.page";
import { ClientsInClub } from "@pages/clientsInClub.page";
import { CloudPaymentPage } from "@pages/cloudPayments.page";
import { ClubsPage } from "@pages/clubs.page";
import { CreateUserPage } from "@pages/createUser.page";
import { DiscountPage } from "@pages/discounts.page";
import { MainPage } from "@pages/main.page";
import { PaymentInformationPage } from "@pages/paymentInformation.page";
import { SchedulePage } from "@pages/schedule.page";
import { test as BaseTest, mergeTests } from '@playwright/test';

const test = mergeTests(BaseTest.extend<{
    authPage: AuthPage
    headerBlock: HeaderBlock
    clientPage: ClientPage
    clientsInClub: ClientsInClub
    createUserPage: CreateUserPage
    menuBlock: MenuBlock
    discountPage: DiscountPage
    schedulePage: SchedulePage
    mainPage: MainPage
    clubsPage: ClubsPage
    analyticsPage: AnalyticsPage
    cloudPaymentPage: CloudPaymentPage
    paymentInformationPage: PaymentInformationPage
}>({
    baseURL: api.urls.base_url_CRM,
    headless: true,
    viewport: { width: 1920, height: 1680 },
    authPage: async ({ }, use) => { await use(new AuthPage()) },
    headerBlock: async ({ }, use) => { await use(new HeaderBlock()) },
    clientsInClub: async ({ }, use) => { await use(new ClientsInClub()) },
    clientPage: async ({ }, use) => { await use(new ClientPage()) },
    createUserPage: async ({ }, use) => { await use(new CreateUserPage()) },
    menuBlock: async ({ }, use) => { await use(new MenuBlock()) },
    discountPage: async ({ }, use) => { await use(new DiscountPage()) },
    schedulePage: async ({ }, use) => { await use(new SchedulePage()) },
    mainPage: async ({ }, use) => { await use(new MainPage()) },
    clubsPage: async ({ }, use) => { await use(new ClubsPage()) },
    analyticsPage: async ({ }, use) => { await use(new AnalyticsPage()) },
    cloudPaymentPage: async ({ }, use) => { await use(new CloudPaymentPage()) },
    paymentInformationPage: async ({ }, use) => { await use(new PaymentInformationPage()) }
}));

export default test;
export const expect = test.expect;   