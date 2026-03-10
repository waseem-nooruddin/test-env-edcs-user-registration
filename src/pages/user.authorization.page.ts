import { Page, Locator, expect } from "@playwright/test";

export class UserAuthorization {
  constructor(private readonly page: Page) {}

  async clickUserAuthorization(): Promise<void> {
    await this.page.getByRole("button", { name: "User Authorization" }).click();
  }

  async searchingUser(userId: string): Promise<void> {
    await this.page.locator("#outlined-basic").fill(userId);
  }

  async verifyUserAuthorizationPage(): Promise<boolean> {
    return await this.page
      .getByRole("heading", { name: "User Authorization" })
      .isVisible();
  }

  // async hoverPendingUser(): Promise<void> {
  //   await this.page.getByRole("row", { name: /Pending/i }).hover();
  // }

  async verifyPendingUser(): Promise<boolean> {
    return await this.page.getByRole("row", { name: /Pending/i }).isVisible();
  }

async authorizeUser(): Promise<void> {

  const row = this.page
    .getByRole("row")
    .filter({ hasText: "Pending" })
    .first();

  await expect(row).toBeVisible();

  const authorizeButton = row
    .locator('div:has-text("Authorize")')
    .locator("button");

  await expect(authorizeButton).toBeEnabled();
  await authorizeButton.click();
}

  async RejectUser(): Promise<void> {
    await this.page.getByRole("button", { name: "Cancel" }).first().click();
  }
}
