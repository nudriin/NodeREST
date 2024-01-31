import Joi from "joi";

const contactCreateValidation = Joi.object({
    first_name : Joi.string().max(100).required(),
    last_name : Joi.string().max(100).optional(),
    email : Joi.string().email().max(200).optional(),
    phone : Joi.string().max(20).optional()
});

const contactGetValidation = Joi.number().positive().required();

const contactUpdateValidation = Joi.object({
    id : Joi.number().positive().required(),
    first_name : Joi.string().max(100).required(),
    last_name : Joi.string().max(100).optional(),
    email : Joi.string().email().max(200).optional(),
    phone : Joi.string().max(20).optional()
});

const contactSearchValidation = Joi.object({
    page : Joi.number().min(1).positive().default(1), // Nomor halaman pagging
    size : Joi.number().min(1).positive().max(100).default(10), // jumlah data dalam 1 page defaultnya 10
    name : Joi.string().optional(),
    email : Joi.string().optional(),
    phone : Joi.string().optional()
});

export {
    contactCreateValidation,
    contactGetValidation,
    contactUpdateValidation,
    contactSearchValidation
}