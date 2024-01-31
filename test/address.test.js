import supertest from "supertest";
import { web } from "../src/app/web";
import { createManyTestAddress, createTestAddress, createTestContact, createTestUser, getContact, getTestAddress, removeAllContacts, removeAllTestAddress, removeTestUser } from "./test-util";


describe("POST /api/contacts/:contactId/addresses", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestAddress();
        await removeAllContacts();
        await removeTestUser();
    });

    it("should create address", async () => {
        const contact = await getContact();
        const res = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set("Authorization", "test")
            .send({
                street: "samudera",
                city: "palangka",
                province: "kalteng",
                country: "indonesia",
                postal_code: "12345"
            });

        console.log(res.body);
        expect(res.status).toBe(200);
        expect(res.body.data.street).toBe("samudera");
        expect(res.body.data.city).toBe("palangka");
        expect(res.body.data.province).toBe("kalteng");
        expect(res.body.data.country).toBe("indonesia");
        expect(res.body.data.postal_code).toBe("12345");
    });

    it("should reject if contactId is invalid", async () => {
        const contact = await getContact();
        const res = await supertest(web)
            .post(`/api/contacts/${contact.id + 122}/addresses`)
            .set("Authorization", "test")
            .send({
                street: "samudera",
                city: "palangka",
                province: "kalteng",
                country: "indonesia",
                postal_code: "12345"
            });

        console.log(res.body);
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
    });

    it("should reject if request is invalid", async () => {
        const contact = await getContact();
        const res = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set("Authorization", "test")
            .send({
                street: "",
                city: "",
                province: "",
                country: "",
                postal_code: ""
            });

        console.log(res.body);
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
    });

    it("should reject if both contactId and request is invalid", async () => {
        const contact = await getContact();
        const res = await supertest(web)
            .post(`/api/contacts/${contact.id + 112}/addresses`)
            .set("Authorization", "test")
            .send({
                street: "",
                city: "",
                province: "",
                country: "",
                postal_code: ""
            });

        console.log(res.body);
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
    });

});

describe("GET /api/contacts/:contactId/addresses", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestAddress();
        await removeAllContacts();
        await removeTestUser();
    });

    it("Should get list address", async () => {
        const contact = await getContact();
        await createManyTestAddress(contact.id);
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses`)
            .set("Authorization", "test");

        console.log(response.body.data);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(15);
    });

    it("should reject if contactId is invalid", async () => {
        const contact = await getContact();
        await createManyTestAddress(contact.id);
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}/addresses`)
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddress();
        await removeAllContacts();
        await removeTestUser();
    });

    it("Should get address by id", async () => {
        const contact = await getContact();
        const address = await getTestAddress();
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(address.id);
        expect(response.body.data.street).toBe("street");
        expect(response.body.data.city).toBe("city");
        expect(response.body.data.province).toBe("province");
        expect(response.body.data.country).toBe("country");
        expect(response.body.data.postal_code).toBe("12345");

    });

    it("Should reject if contactId invalid", async () => {
        const contact = await getContact();
        const address = await getTestAddress();
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();

    });

    it("Should reject if addressId invalid", async () => {
        const contact = await getContact();
        await createTestAddress(contact.id);
        const address = await getTestAddress(contact.id);
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id + 123}`)
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("Should reject if both contactId and addressId invalid", async () => {
        const contact = await getContact();
        await createTestAddress(contact.id);
        const address = await getTestAddress(contact.id);
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}/addresses/${address.id + 1}`)
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddress();
        await removeAllContacts();
        await removeTestUser();
    });

    it("Should update address", async () => {
        const contact = await getContact();
        const address = await getTestAddress();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("Authorization", "test")
            .send({
                street: "Jalan Setia Yakin",
                city: "Sukamara",
                province: "Kalimantan Tengah",
                country: "Indonesia",
                postal_code: "74712"
            });

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(address.id);
        expect(response.body.data.street).toBe("Jalan Setia Yakin");
        expect(response.body.data.city).toBe("Sukamara");
        expect(response.body.data.province).toBe("Kalimantan Tengah");
        expect(response.body.data.country).toBe("Indonesia");
        expect(response.body.data.postal_code).toBe("74712");
    });

    it("Should reject if contact id is invalid", async () => {
        const contact = await getContact();
        const address = await getTestAddress();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("Authorization", "test")
            .send({
                street: "Jalan Setia Yakin",
                city: "Sukamara",
                province: "Kalimantan Tengah",
                country: "Indonesia",
                postal_code: "74712"
            });

        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("Should reject if address id is invalid", async () => {
        const contact = await getContact();
        const address = await getTestAddress();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set("Authorization", "test")
            .send({
                street: "Jalan Setia Yakin",
                city: "Sukamara",
                province: "Kalimantan Tengah",
                country: "Indonesia",
                postal_code: "74712"
            });

        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("Should reject if both contact id and address id is invalid", async () => {
        const contact = await getContact();
        const address = await getTestAddress();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id + 1}/addresses/${address.id + 1}`)
            .set("Authorization", "test")
            .send({
                street: "Jalan Setia Yakin",
                city: "Sukamara",
                province: "Kalimantan Tengah",
                country: "Indonesia",
                postal_code: "74712"
            });

        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });


});

describe("DELETE /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddress();
        await removeAllContacts();
        await removeTestUser();
    });

    it("Should delete address", async () => {
        const contact = await getContact();
        const address = await getTestAddress();

        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("Authorization", "test")

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");
    });

    it("Should reject if contactId is invalid", async () => {
        const contact = await getContact();
        const address = await getTestAddress();

        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id + 112}/addresses/${address.id}`)
            .set("Authorization", "test")

        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("Should reject if addressId is invalid", async () => {
        const contact = await getContact();
        const address = await getTestAddress();

        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id + 123}`)
            .set("Authorization", "test")

        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("Should reject if both contactId and addressId is invalid", async () => {
        const contact = await getContact();
        const address = await getTestAddress();

        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id + 112}/addresses/${address.id + 123}`)
            .set("Authorization", "test")

        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});