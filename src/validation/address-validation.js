import Joi from "joi";

// street String? @db.VarChar(255)
//   city String? @db.VarChar(100)
//   province String? @db.VarChar(100)
//   country String @db.VarChar(100)
//   postal_code String @db.VarChar(10)
const addressCreateValidation = Joi.object({
    street : Joi.string().max(255).optional(),
    city : Joi.string().max(100).optional(),
    province : Joi.string().max(100).optional(),
    country : Joi.string().max(100).required(),
    postal_code : Joi.string().max(10).required(),
});

const addressUpdateValidation = Joi.object({
    id : Joi.number().min(1).positive().required(),
    street : Joi.string().max(255).optional(),
    city : Joi.string().max(100).optional(),
    province : Joi.string().max(100).optional(),
    country : Joi.string().max(100).required(),
    postal_code : Joi.string().max(10).required(),
});

const addressGetValidation = Joi.number().positive().required();

export {
    addressCreateValidation,
    addressGetValidation,
    addressUpdateValidation
}