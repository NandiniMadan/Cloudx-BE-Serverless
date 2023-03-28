import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { products } from 'src/mockData/productsList';

import schema from './schema';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const product = products.find(data => data.id === event.pathParameters.id);

  if (!product) {
    return formatJSONResponse({
      message: `Product with id: ${event.pathParameters.id} not found.`
    });
  }

  return formatJSONResponse({
    message: `Success Response from getProductById`,
    body: {
      data: { ...product }
    }
  });
};

export const main = middyfy(getProductById);
