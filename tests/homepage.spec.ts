import { test } from '@playwright/test';
import { AmazonPage } from '../pages/amazon-page';

const products = [
  { name: 'iPhone', searchTerm: 'iPhone', productName: /iPhone 16 Pro/i},
  //*(GB|Unlocked|eSIM)/i },
  { name: 'Galaxy device', searchTerm: 'Samsung Galaxy phone', productName: /Samsung|Galaxy/i },
];

for (const product of products) {
  test(`Search and add ${product.name} to cart`, async ({ page }) => {
    const amazon = new AmazonPage(page);

    await amazon.goto();
    await amazon.searchFor(product.searchTerm);
    const price = await amazon.addFirstAvailableResultToCart(product.productName);
    console.log(`The price of the selected ${product.name} is: ${price}`);
  });
}
