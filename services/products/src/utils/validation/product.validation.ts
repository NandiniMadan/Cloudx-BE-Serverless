const Joi = require('joi');

export const create = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number().required(),
        count: Joi.number().required()
    }),
};