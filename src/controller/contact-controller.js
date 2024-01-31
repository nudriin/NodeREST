import contactService from "../service/contact-service.js";

const create = async (req, res, next) => {
    try {
        const result = await contactService.createContact(req.user, req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const user = req.user; // ambil dengan token
        const contactId = req.params.contactId; // ambil dari params
        const result = await contactService.getContact(user, contactId);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = parseInt(req.params.contactId);
        const request = req.body;
        request.id = contactId; // get contact id params
        const result = await contactService.updateContact(user, request);

        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.contactId;
        await contactService.deleteContact(user, contactId);
        res.status(200).json({
            data : "OK"
        })
    } catch (e) {
        next(e);
    }
}

const search = async (req, res, next) => {
    try {
        const user = req.user;
        const request = {
            name : req.query.name, //jika ada query pameter maka adatanya akan di ambil
            email : req.query.email, //jika ada query pameter maka adatanya akan di ambil
            phone : req.query.phone, //jika ada query pameter maka adatanya akan di ambil
            page : req.query.page, //jika ada query pameter maka adatanya akan di ambil
            size : req.query.size, //jika ada query pameter maka adatanya akan di ambil
        }

        const result = await contactService.searchContact(user, request);

        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
} 

export default {
    create,
    get,
    update,
    remove,
    search
}