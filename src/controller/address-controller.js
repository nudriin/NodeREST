import addressService from "../service/address-service.js";

const create = async (req, res, next) => {
    try {
        const contactId = req.params.contactId;
        const user = req.user;
        const result = await addressService.createAddress(user, contactId, req.body);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const list = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.contactId;
        const result = await addressService.listAddress(user, contactId);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.contactId;
        const addressId = req.params.addressId;

        const result = await addressService.getAddress(user, contactId, addressId);
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
        const contactId = req.params.contactId;
        const addressId = req.params.addressId;
        const request = req.body;
        request.id = addressId;

        const result = await addressService.updateAddress(user, contactId, request);
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
        const addressId = req.params.addressId;

        await addressService.removeAddress(user, contactId, addressId);
        res.status(200).json({
            data : "OK"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    get,
    list,
    update,
    remove
}