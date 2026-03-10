import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { ProductPage } from "../../pages/product.page";
import { UserManagementPage } from "../../pages/user.management.page";
import { credentials } from "../resources/credentials";
import { NavBarPage } from "../../pages/navbar.page";
import { testdata } from "../resources/testdata";
import { ResetPasswordPage } from "../../pages/forgot.password.page";
import { UserAuthorization } from "../../pages/user.authorization.page";

test.describe("User Page", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test(
    "Verify successful User ID validation and auto-fetch from HRMS",
    { tag: ["@regression", "@TC_01", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      const userManagementPage = new UserManagementPage(page);
      await userManagementPage.clickAddNewUser();
      await userManagementPage.enterLoginID(testdata.Employee_Number);
      const empNumber = await page.locator("#root_empNumber").inputValue();
      expect(empNumber).toBe("");
      await userManagementPage.clickValidateButton();
    },
  );

  test(
    "Verify assigning a valid user role",
    { tag: ["@regression", "@TC_02", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      const userManagementPage = new UserManagementPage(page);
      await userManagementPage.clickAddNewUser();
      await userManagementPage.enterLoginID(testdata.Employee_Number);
      await userManagementPage.clickValidateButton();
      await userManagementPage.enterUserRoleId();
      await userManagementPage.selectUserRoleId(testdata.User_Role_Id);
      await userManagementPage.enterSubmitButton();
    },
  );

  test(
    "Verify system response for invalid User ID",
    { tag: ["@regression", "@TC_03", "@negative"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      const userManagementPage = new UserManagementPage(page);
      await userManagementPage.clickAddNewUser();
      await userManagementPage.enterLoginID(testdata.NegativeEmployee_Number);
      await userManagementPage.clickValidateButton();
      await expect(page.getByRole("heading")).toContainText("Error");
    },
  );

  test(
    "Validate mandatory error when User ID is blank",
    { tag: ["@regression", "@TC_04", "@negative"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      const userManagementPage = new UserManagementPage(page);
      await userManagementPage.clickAddNewUser();
      await userManagementPage.enterLoginID("");
      await expect(
        page.getByRole("button", { name: "Validate" }),
      ).toBeDisabled();
    },
  );

  test(
    "Validate the entered User ID and reassign the same role to the user.",
    { tag: ["@regression", "@TC_06", "@negative"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      const userManagementPage = new UserManagementPage(page);
      await userManagementPage.clickAddNewUser();
      await userManagementPage.enterLoginID(testdata.Employee_Number);
      await userManagementPage.clickValidateButton();
      await userManagementPage.enterUserRoleId();
      await userManagementPage.selectUserRoleId(testdata.User_Role_Id);
      await userManagementPage.enterSubmitButton();
      await expect(page.getByRole("heading")).toContainText("Error");
    },
  );

  test(
    "Validate and assign new role",
    { tag: ["@regression", "@TC_07", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.Newusername, credentials.Newpassword);
      await expect(
        page.getByText("Please change password before login to the system !"),
      ).toBeVisible();
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page.getByText("Reset Password").first()).toBeVisible();
      const resetPasswordPage = new ResetPasswordPage(page);
      await resetPasswordPage.CurrentPassword(credentials.Newpassword);
      await resetPasswordPage.NewPassword(credentials.New_password);
      await resetPasswordPage.ConfirmNewPassword(credentials.New_password);
      await resetPasswordPage.ResetPassword();
    },
  );

  test(
    "Verify that auto-filled fields are non-editable.",
    { tag: ["@regression", "@TC_08", "@alternative"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      const userManagementPage = new UserManagementPage(page);
      await userManagementPage.clickAddNewUser();
      await userManagementPage.enterLoginID(testdata.Employee_Number);
      await userManagementPage.clickValidateButton();
      await userManagementPage.enterUserRoleId();
      await userManagementPage.selectUserRoleId(testdata.User_Role_Id);
      await expect(page.locator("#root_name")).toBeDisabled();
    },
  );

  test(
    "Verify system validation when clicking 'Assign' without selecting a role.",
    { tag: ["@regression", "@TC_09", "@negative"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      const userManagementPage = new UserManagementPage(page);
      await userManagementPage.clickAddNewUser();
      await userManagementPage.enterLoginID(testdata.Employee_Number);
      await userManagementPage.clickValidateButton();
      await userManagementPage.enterSubmitButton();
      await expect(page.getByRole("heading")).toContainText("Error");
    },
  );

  test(
    "Attempt to assign a role before completing the required validation.",
    { tag: ["@regression", "@TC_10", "@negative"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      const userManagementPage = new UserManagementPage(page);
      await userManagementPage.clickAddNewUser();
      await userManagementPage.enterUserRoleId();
      await userManagementPage.selectUserRoleId(testdata.User_Role_Id);
      await userManagementPage.enterSubmitButton();
      await expect(page.locator('//p[@id="root_branchId"]')).toHaveText(
        "is a required property",
      );
    },
  );

  test(
    "Verify that after changing the User ID, the system validates the updated value.",
    { tag: ["@regression", "@TC_11", "@alternative"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      const userManagementPage = new UserManagementPage(page);
      await userManagementPage.clickAddNewUser();
      await userManagementPage.enterLoginID(testdata.Employee_Number);
      await userManagementPage.clickValidateButton();
      await userManagementPage.enterUserRoleId();
      await userManagementPage.selectUserRoleId(testdata.User_Role_Id);
      await userManagementPage.enterSubmitButton();
      expect(page.locator("#root_loginID")).toBeVisible();
      await userManagementPage.enterLoginID(testdata.ndEmployee_Number);
    },
  );

  test(
    "Verify “Edit” option allows modification",
    { tag: ["@regression", "@TC_12", "@alternative"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.navigateToUserPage();
      await expect(
        page.getByRole("heading", { name: "View All Users" }),
      ).toBeVisible();
      await page.getByTitle("Edit").first().click();
      await expect(
        page.getByRole("heading", { name: "Edit User Details" }),
      ).toBeVisible();
      await page.locator("#root_branchId").click();
    },
  );

  test(
    "Verify user authorization process",
    { tag: ["@smoke", "@TC_13", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.clickUserAuthorization();
      const userAuthorization = new UserAuthorization(page);
      await expect(
        page.getByRole("heading", { name: "User Authorization" }),
      ).toBeVisible();
      await userAuthorization.authorizeUser();
    },
  );

    test(
    "Verify that rejecting a user disables their ability to log in.",
    { tag: ["@smoke", "@TC_14", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      await navBarpage.clickUserAuthorization();
      const userAuthorization = new UserAuthorization(page);
      await expect(
        page.getByRole("heading", { name: "User Authorization" }),
      ).toBeVisible();
      await userAuthorization.RejectUser();
    },
  );

      test(
    "Verify temporary inactivation",
    { tag: ["@smoke", "@TC_17", "@positive"] },
    async ({ page }) => {
      await loginPage.login(credentials.username, credentials.password);
      const navBarpage = new NavBarPage(page);
      await navBarpage.clickUserManagement();
      const userManagementPage = new UserManagementPage(page);
      await userManagementPage.navigateToUserPage();
      await userManagementPage.clickInactiveButton(testdata.restrictionReason);

    },
  );
});
