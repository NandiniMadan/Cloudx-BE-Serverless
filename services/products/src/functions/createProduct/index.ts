import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'product',
        responseData: {
          200: {
            description: 'Successful operation',
            bodyType: 'Products',
          },
          404: 'Products not found',
          500: 'Server error',
        },
      },
    },
  ],
};
