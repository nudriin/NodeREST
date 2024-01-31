import { prismaClient } from "../app/database.js"
import { contactGetValidation } from "../validation/contact-validation.js";
import { ResponseError } from "../error/response-error.js";
import { addressCreateValidation, addressGetValidation, addressUpdateValidation } from "../validation/address-validation.js";
import { validate } from "../validation/validation.js";

const createAddress = async (user, contactId, request) => {
    const id = validate(contactGetValidation, contactId);
    const requestValid = validate(addressCreateValidation, request);

    const contact = await prismaClient.contact.count({
        where: {
            id: id
        }
    });

    if (contact !== 1) {
        throw new ResponseError(404, "Contact is not found");
    }

    requestValid.contact_id = id;

    const address = await prismaClient.address.create({
        data: requestValid,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });

    return address;
}

const contactMustExist = async (user, contactId) => {
    const validContactId = validate(contactGetValidation, contactId);

    const countContact = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: validContactId
        }
    });

    if (countContact !== 1) {
        throw new ResponseError(404, "contact is not found");
    }

    return validContactId;
}

const getAddress = async (user, contactId, addressId) => {
    const validContactId = await contactMustExist(user, contactId);
    const validAddressId = validate(addressGetValidation, addressId);

    const countAddress = await prismaClient.address.count({
        where: {
            id : validAddressId,
            contact_id : validContactId
        }
    });

    if (countAddress !== 1) {
        throw new ResponseError(404, "Address is not found");
    }

    const address = await prismaClient.address.findFirst({
        where: {
            contact_id: validContactId,
            id: validAddressId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });

    return address;
}

const listAddress = async (user, contactId) => {
    const validContactId = await contactMustExist(user, contactId);


    const countAddress = await prismaClient.address.count({
        where: {
            contact_id: validContactId
        }
    });

    if (countAddress === 0) {
        throw new ResponseError(404, "Address not found");
    }

    const address = await prismaClient.address.findMany({
        where: {
            contact_id: validContactId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });

    return address;
}

const updateAddress = async (user, contactId, request) => {
    const validContactId = await contactMustExist(user, contactId);
    const validRequest = validate(addressUpdateValidation, request);

    const countAddress = await prismaClient.address.count({
        where: {
            contact_id: validContactId,
            id: validRequest.id
        }
    });

    if (countAddress !== 1) {
        throw new ResponseError(404, "Address is not found");
    }

    const address = await prismaClient.address.update({
        where: {
            id: validRequest.id
        },
        data: {
            street: validRequest.street,
            city: validRequest.city,
            province: validRequest.province,
            country: validRequest.country,
            postal_code: validRequest.postal_code,
            street: validRequest.street,
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });

    return address;
}

const removeAddress = async (user, contactId, addressId) => {
    const validContactId = await contactMustExist(user, contactId);
    const validAddressId = validate(addressGetValidation, addressId);

    const countAddress = await prismaClient.address.count({
        where : {
            id : validAddressId,
            contact_id : validContactId
        }
    });

    if(countAddress !== 1 ) {
        throw new ResponseError(404, "Address is not found");
    }

    await prismaClient.address.delete({
        where : {
            id : validAddressId
        }
    });
}

export default {
    createAddress,
    getAddress,
    listAddress,
    updateAddress,
    removeAddress
}