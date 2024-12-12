import Joi from 'joi';

const createItemSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Field "name" is required',
        'any.required': 'Field "name" is required',
    }),
    price: Joi.number().min(0).required().messages({
        'number.base': 'Field "price" must be a number',
        'any.required': 'Field "price" is required',
        'number.min': 'Field "price" cannot be negative'
    }),
});
const updateItemSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Field "name" is required',
    }),
    price: Joi.number().min(0).required().messages({
        'number.base': 'Field "price" must be a number',
        'number.min': 'Field "price" cannot be negative'
    }),
});

function formatJoiError(error: Joi.ValidationError) {
    return {
        errors: error.details.map(detail => ({
            field: detail.context?.key,
            message: detail.message,
        })),
    };
}
export async function validateCreate(data: any) {
    const { error, value } = createItemSchema.validate(data, { abortEarly: false });
    if (error) {
        return formatJoiError(error);
    }
    return null;
}
export async function validateUpdate(data: any) {
    const { error, value } = updateItemSchema.validate(data, { abortEarly: false });
    if (error) {
        return formatJoiError(error);
    }
    return null; 
}




