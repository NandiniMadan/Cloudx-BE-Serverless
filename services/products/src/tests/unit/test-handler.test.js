import { getProductsByIdMockData, getProductsMockData } from "../../libs/products-mock-data";
const data = require('../../mocks/products.json');

describe('Unit test for products', function () {
    it('Verifies get products list function', async () => {
        const result = await getProductsMockData();
        expect(result).toEqual(data.products);
    });

    it('Verifies get product by id function', async () => {
        const result = await getProductsByIdMockData("7567ec4b-b10c-48c5-9345-fc73c48a80aa");
        expect(result).toEqual(data.products[0]);
    });
});