import { prismaClient } from "../src/app/database.js";
import bcrypt from "bcrypt";

const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "test"
        }
    });
}

const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "test",
            password: await bcrypt.hash("12345678", 10),
            name: "test",
            token: "test"
        }
    });
}

const getUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "test"
        }
    });
}

const removeAllContacts = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            username: "test"
        }
    });
}

const createTestContact = async () => {
    return prismaClient.contact.create({
        data: {
            username: "test",
            first_name: "test",
            last_name: "test",
            email: "test@gmail.com",
            phone: "081549193834"
        }
    });
}

const createManyTestContacts = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.contact.create({
            data: {
                username: "test",
                first_name: `test ${i}`,
                last_name: `test ${i}`,
                email: `test${i}@gmail.com`,
                phone: `081549193834${i}`
            }
        });
    }
}

const getContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: "test"
        }
    });
}

const removeAllTestAddress = async () => {
    return prismaClient.address.deleteMany({
        where: {
            contacts: {
                username: "test"
            }
        }
    })
}

const createManyTestAddress = async (contact_id) => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.address.create({
            data: {
                street: `street ${i}`,
                city: `city ${i}`,
                province: `province ${i}`,
                country: `country ${i}`,
                postal_code: `12345${i}`,
                contact_id: contact_id
            }
        });
    }
}

const createTestAddress = async () => {
    const contact = await getContact();
    await prismaClient.address.create({
        data: {
            street: `street`,
            city: `city`,
            province: `province`,
            country: `country`,
            postal_code: `12345`,
            contact_id: contact.id
        }
    });
}

const getTestAddress = async () => {
    return prismaClient.address.findFirst({
        where: {
            contacts: {
                username: "test"
            }
        }
    })
}

export {
    removeTestUser,
    createTestUser,
    getUser,
    removeAllContacts,
    createTestContact,
    getContact,
    createManyTestContacts,
    removeAllTestAddress,
    createManyTestAddress,
    createTestAddress,
    getTestAddress

}