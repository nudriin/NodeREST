import Joi from "joi";
// register user validate
const userRegistrationValidation = Joi.object({
    username : Joi.string().max(100).required(),
    password : Joi.string().min(8).max(100).required(),
    name : Joi.string().max(100).required()
});

const userLoginValidation = Joi.object({
    username : Joi.string().max(100).required(),
    password : Joi.string().min(8).max(100).required()
});

const userGetValidation = Joi.string().max(100).required();

const userUpdateValidation = Joi.object({
    username : Joi.string().max(100).required(),
    password : Joi.string().min(8).max(100).optional(), // optional boleh diisi boleh enggak
    name : Joi.string().max(100).optional() // opsional, boleh di isi boleh tidak
})

export {
    userRegistrationValidation,
    userLoginValidation,
    userGetValidation,
    userUpdateValidation
}


