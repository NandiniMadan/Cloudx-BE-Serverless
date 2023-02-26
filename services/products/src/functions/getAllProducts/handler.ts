import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { products } from '../../mockData/productsList';

import schema from './schema';

const getAllProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  return formatJSONResponse({
    message: `Hello from getAllProducts`,
    body: [...products]
  });
};

export const main = middyfy(getAllProducts);
