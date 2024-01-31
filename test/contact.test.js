import { createManyTestContacts, createTestContact, createTestUser, getContact, removeAllContacts, removeTestUser } from "./test-util";
import supertest from "supertest";
import { web } from "../src/app/web";


describe("POST /api/contacts", () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllContacts();
        await removeTestUser();
    });

    it("Should create contact user", async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "test")
            .send({
                first_name: "Nurdin",
                last_name: "Hishasy",
                email: "nudriin@gmail.com",
                phone: "081549193834",
            });

        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe("Nurdin");
        expect(response.body.data.last_name).toBe("Hishasy");
        expect(response.body.data.email).toBe("nudriin@gmail.com");
        expect(response.body.data.phone).toBe("081549193834");
    });

    it("Should reject if request invalid", async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "test")
            .send({
                first_name: "",
                last_name: "Hishasy",
                email: "nudriinasdasa",
                phone: "081549193834128312378127381273",
            });

        console.log(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

});

describe("GET /api/contacts/:contactId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllContacts();
        await removeTestUser();
    });

    it("Should get contact", async () => {
        const contact = await getContact();

        const response = await supertest(web)
            .get("/api/contacts/" + contact.id) // get contact id
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(contact.id);
        expect(response.body.data.first_name).toBe("test");
        expect(response.body.data.last_name).toBe("test");
        expect(response.body.data.email).toBe("test@gmail.com");
        expect(response.body.data.phone).toBe("081549193834");

    });

    it("Should return 404 if contact id is wrong", async () => {
        const contact = await getContact();

        const response = await supertest(web)
            .get("/api/contacts/" + contact.id + 1) // contact id wrong
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();

    });
});

describe("PUT /api/contacts/:contactId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllContacts();
        await removeTestUser();
    });

    it("should update contact", async () => {
        const contact = await getContact();
        const response = await supertest(web)
            .put("/api/contacts/" + contact.id)
            .set("Authorization", "test")
            .send({
                first_name: "Nurdin",
                last_name: "Hishasy",
                email: "nudriin@gmail.com",
                phone: "0812000000"
            });

        console.log(contact);
        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(contact.id);
        expect(response.body.data.first_name).toBe("Nurdin");
        expect(response.body.data.last_name).toBe("Hishasy");
        expect(response.body.data.email).toBe("nudriin@gmail.com");
        expect(response.body.data.phone).toBe("0812000000");
    });

    it("should reject if request invalid", async () => {
        const contact = await getContact();
        const response = await supertest(web)
            .put("/api/contacts/" + contact.id)
            .set("Authorization", "test")
            .send({
                first_name: "",
                last_name: "",
                email: "nudriin",
                phone: "081200000000999900000000"
            });

        console.log(contact);
        console.log(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject if contact not found", async () => {
        const contact = await getContact();
        const response = await supertest(web)
            .put("/api/contacts/" + contact.id + 10)
            .set("Authorization", "test")
            .send({
                first_name: "Nurdin",
                last_name: "Hishasy",
                email: "nudriin@gmail.com",
                phone: "0812000000"
            });

        console.log(contact);
        console.log(response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });


});

describe("DELETE /api/contacts/:contactId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllContacts();
        await removeTestUser();
    });

    it("Should delete contact", async () => {
        let contact = await getContact();
        const response = await supertest(web)
            .delete("/api/contacts/" + contact.id)
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");

        contact = await getContact();
        expect(contact).toBeNull();
    });

    it("Should reject if contact is not found", async () => {
        let contact = await getContact();
        const response = await supertest(web)
            .delete("/api/contacts/" + contact.id + 1)
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();

        contact = await getContact();
        expect(contact).toBeDefined();
    });
});

describe("GET /api/contacts", () => {
    beforeEach(async () => {
        await createTestUser();
        await createManyTestContacts();
    });

    afterEach(async () => {
        await removeAllContacts();
        await removeTestUser();
    });

    it("Should can search without params", async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(10);
        expect(response.body.paging.page).toBe(1); 
        expect(response.body.paging.total_item).toBe(15); 
        expect(response.body.paging.total_page).toBe(2); 
    });

    it("Should can search to page 2", async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .query({
                page : 2
            })
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(5);
        expect(response.body.paging.page).toBe(2); 
        expect(response.body.paging.total_item).toBe(15); 
        expect(response.body.paging.total_page).toBe(2); 
    });
    
    it("Should can search by name", async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .query({
                name : "test 1" // * akan get test 1, test 10, test 11, test 12, test 13, test 14
            })
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(6);
        expect(response.body.paging.page).toBe(1); 
        expect(response.body.paging.total_item).toBe(6); 
        expect(response.body.paging.total_page).toBe(1); 
    });

    it("Should can search by email", async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .query({
                email : "test1" // * akan get test1@gmail.com, test10@gmail.com, test11@gmail.com, test12@gmail.com, test13@gmail.com, test14@gmail.com
            })
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(6);
        expect(response.body.paging.page).toBe(1); 
        expect(response.body.paging.total_item).toBe(6); 
        expect(response.body.paging.total_page).toBe(1); 
    });

    it("Should can search by phone", async () => {
        const response = await supertest(web)
            .get("/api/contacts")
            .query({
                phone : "0815491938341" // * akan get 0815491938341, 08154919383410, 08154919383411, 08154919383412, 08154919383413, 08154919383414
            })
            .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(6);
        expect(response.body.paging.page).toBe(1); 
        expect(response.body.paging.total_item).toBe(6); 
        expect(response.body.paging.total_page).toBe(1); 
    });
});