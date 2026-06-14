import { expect, type Locator, type Page } from '@playwright/test';

export class AmazonPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#twotabsearchtextbox');
    this.cartButton = page.locator('#add-to-cart-button, input[name="submit.add-to-cart"]');
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.searchInput).toBeVisible();
    await this.dismissInternationalShoppingPrompt();
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await Promise.all([
      this.page.waitForURL(/\/s\?k=/, { timeout: 10_000 }),
      this.page.locator('#nav-search-submit-button').click(),
    ]).catch(async () => {
      await this.page.goto(`/s?k=${encodeURIComponent(term)}`);
    });

    await expect(this.page.getByRole('listitem').filter({ has: this.page.locator('a:has(h2)') }).first()).toBeVisible();
    await this.dismissInternationalShoppingPrompt();
  }

  async addFirstAvailableResultToCart(productName: RegExp) {
    const cartableProduct = this.page
      .getByRole('listitem')
      .filter({ hasText: productName })
      .filter({ has: this.page.getByRole('button', { name: /^Add to cart$/i }) })
      .first();

    if (await cartableProduct.isVisible().catch(() => false)) {
      const price = await this.getPriceFrom(cartableProduct);
      await cartableProduct.getByRole('button', { name: /^Add to cart$/i }).click();
      await this.verifyAddedToCart();
      return price;
    }

    const product = this.page
      .getByRole('listitem')
      .filter({ hasText: productName })
      .filter({ has: this.page.locator('.a-price') })
      .first();

    const price = await this.getPriceFrom(product);
    await product.locator('a:has(h2)').first().click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.dismissInternationalShoppingPrompt();

    await expect(this.cartButton.first()).toBeVisible();
    await this.cartButton.first().click();
    await this.verifyAddedToCart();

    return price;
  }

  private async dismissInternationalShoppingPrompt() {
    const dismissButton = this.page.locator('input[data-action-type="DISMISS"]').first();

    if (await dismissButton.isVisible().catch(() => false)) {
      await dismissButton.click({ force: true, timeout: 2_000 }).catch(() => undefined);
    }
  }

  private async getPriceFrom(product: Locator) {
    const price = product
      .locator('.a-price')
      .first();

    await expect(price).toBeVisible();
    return (await price.locator('.a-offscreen').first().textContent())?.trim()
      ?? (await price.innerText()).replace(/\s+/g, '').trim();
  }

  private async verifyAddedToCart() {
    const confirmation = this.page
      .locator('#attach-display-products-status-text-id, #NATC_SMART_WAGON_CONF_MSG_SUCCESS, #sw-atc-confirmation')
      .first();
    const cartCount = this.page.locator('#nav-cart-count');

    await expect.poll(async () => {
      if (await confirmation.isVisible().catch(() => false)) {
        return true;
      }

      return (await cartCount.textContent().catch(() => '0')) !== '0';
    }).toBe(true);
  }
}
