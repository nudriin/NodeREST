import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import { contactCreateValidation, contactGetValidation, contactSearchValidation, contactUpdateValidation } from "../validation/contact-validation.js"
import { validate } from "../validation/validation.js"

const createContact = async (user, request) => {
    const contact = validate(contactCreateValidation, request);
    contact.username = user.username; // menambah property username ke contact

    const result = await prismaClient.contact.create({
        data: contact, // langsung contact karena contact adalah object
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });

    return result;
}

const getContact = async (user, contactId) => {
    const id = validate(contactGetValidation, contactId);

    const contact = await prismaClient.contact.findFirst({
        where: {
            // ! SELECT * FROM contact WHERE username = ? AND id = ?
            username: user.username,
            id: id
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });

    if (!contact) {
        throw new ResponseError(404, "Contact not found");
    }

    return contact;
}

const updateContact = async (user, request) => {
    const contact = validate(contactUpdateValidation, request);

    const countContact = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contact.id
        }
    });

    if (countContact !== 1) {
        throw new ResponseError(404, "Contact not found");
    }

    const result = await prismaClient.contact.update({
        where: {
            id: contact.id
        },
        data: {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });

    return result;
}

const deleteContact = async (user, contactId) => {
    const id = validate(contactGetValidation, contactId);

    const countContact = await prismaClient.contact.count({
        where : {
            username : user.username,
            id : id
        }
    });

    if(countContact !== 1) {
        throw new ResponseError(404, "Contact is not found");
    }

    await prismaClient.contact.delete({
        where : {
            id : id,
            username : user.username
        }
    });
}

const searchContact = async (user, request) => {
    const requestValid = validate(contactSearchValidation, request);

    // ! Membuat skip pagging
    const skip = (requestValid.page - 1) * requestValid.size;

    // ! ini akan menjadi data dari AND
    const filters = []; // membuat array kosong untuk di filter data request yang masuk apa saja

    // ! ini wajib
    filters.push({
        username : user.username // untuk get usernamenya
    })

    // * jika namenya ada maka akan di push
    if(requestValid.name) {
        filters.push({
            OR : [
                {
                    first_name : {
                        contains : requestValid.name
                    }
                },
                {
                    last_name : {
                        contains : requestValid.name
                    }
                }
            ]
        });
    }
    
    // * jika emailnya ada maka akan di push
    if(requestValid.email) {
        filters.push({
            email : {
                contains : requestValid.email
            }
        });
    }
    
    // * jika phonenya ada maka akan di push
    if(requestValid.phone) {
        filters.push({
            phone : {
                contains : requestValid.phone
            }
        });
    }

    const contacts = await prismaClient.contact.findMany({
        where : {
            AND : filters
        },
        take : requestValid.size, // data yang akan di ambil (default 10)
        skip : skip // data yang akan di skip/di lewati
    });

    const totalItem = await prismaClient.contact.count({
        where : {
            AND : filters
        }
    });

    // ! di return dalam bentuk object
    return {
        data : contacts,
        paging : {
            page : requestValid.page,
            total_page : Math.ceil(totalItem / requestValid.size), // dibulatkan ke atas dengn ceil karena bisa saja ada komanya
            total_item : totalItem
        }
    }
}

export default {
    createContact,
    getContact,
    updateContact,
    deleteContact,
    searchContact 
}