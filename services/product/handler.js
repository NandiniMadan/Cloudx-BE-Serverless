'use strict';

const products = [
  {
    id: '1',
    title: 'product1',
    price: '2',
    count: 5,
    category: 'c-1',
    description: 'd1'
  },
  {
    id: '2',
    title: 'product2',
    price: '25',
    count: 2,
    category: 'c-3',
    description: 'd2'
  },
  {
    id: '3',
    title: 'product3',
    price: '7',
    count: 1,
    category: 'c-1',
    description: 'd3'
  },
  {
    id: '4',
    title: 'product4',
    price: '55',
    count: 7,
    category: 'c-2',
    description: 'd4'
  },
  {
    id: '5',
    title: 'product5',
    price: '24',
    count: 15,
    category: 'c-3',
    description: 'd5'
  },

];

const getAllProducts = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify
      ({
        message: 'Success response from getAllProducts Lambda !!!',
        data: [...products]
      })
  };
};

const getProductById = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Success response from getProductById Lambda !!!',
      data: products.find(data => data.id === event.pathParameters.id) || { message: `Product of id:${event.pathParameters.id} not found` }
    })
  };
};

module.exports = {
  getAllProducts,
  getProductById
}
