import supertest from "supertest";
import { web } from "../src/app/web.js";
import { logger } from "../src/app/logging.js";
import { createTestUser, getUser, removeTestUser } from "./test-util.js";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {

    // setiap selesai kita akan delete datanya di database
    afterEach(async () => {
        await removeTestUser()
    })
    it("Should can register new user", async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "12345678",
                name: "test"
            });

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");

        logger.info(response.body);
        logger.info(response.text);
    });

    it("should reject if request invalid", async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "",
                password: "",
                name: ""
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined(); // harus ada errorsnya
        logger.info(response.body);
        logger.info(response.text);
    });

    it("Should reject if request duplicate", async () => {
        let response = await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "12345678",
                name: "test"
            });

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");

        logger.info(response.body);


        response = await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "12345678",
                name: "test"
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toBe("Username is already exist");

        logger.info(response.body);
    });
});

describe("POST /api/users/login", () => {

    // sebelum di mulai unit testnya akan buat user dulu
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });
    it("should can login user", async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "test",
                password: "12345678"
            });

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.token).toBeDefined();
        expect(response.body.data.token).not.toBe("test");
    });
    it("should reject invalid login user", async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "",
                password: ""
            });

        logger.info(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject if password is wrong login user", async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "test",
                password: "12345678909089"
            });

        logger.info(response.body);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
    it("should reject if username is wrong login user", async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "salah",
                password: "12345678"
            });

        logger.info(response.body);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});

describe("GET /api/users/current", () => {
    // sebelum di mulai unit testnya akan buat user dulu
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it("Should get user", async () => {
        const response = await supertest(web)
            .get("/api/users/current")
            .set("Authorization", "test"); // membuat header authorization

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
    });

    it("should reject if token is invalid", async () => {
        const response = await supertest(web)
            .get("/api/users/current")
            .set("Athorization", "salah");

        console.log(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
        // expect(response.body.data.name).toBe("test");
    });
});

describe("PATCH /api/users/current", () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it("Should be update user name", async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                name: "Nurdin" // coba update namanya saja
            });

        console.log(response.body);
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("Nurdin");
    });

    it("Should be update user password", async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                password: "rahasia123" // coba update paswordnya saja
            });

        console.log(response.body);
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");

        const user = await getUser();
        expect(await bcrypt.compare("rahasia123", user.password)).toBe(true);
    });

    it("Should be update user name and user password", async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                name: "Nurdin", // coba update nama
                password: "rahasia123" // coba update password
            });

        console.log(response.body);
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("Nurdin");

        const user = await getUser();
        expect(await bcrypt.compare("rahasia123", user.password)).toBe(true);
    });

    it("Should be reject if data is blank", async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({});

        console.log(response.body);
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
    });
    it("Should be reject if username and password blank", async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                password : "",
                name : ""
            });

        console.log(response.body);
        expect(response.body.errors).toBeDefined();
    });
});

describe("DELETE /api/users/logout", () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it("Should be logout", async () => {
        const response = await supertest(web)
        .delete("/api/users/logout")
        .set("Authorization", "test");

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");

        const user = await getUser();
        expect(user.token).toBeNull();
    });

    it("Should be reject logout", async () => {
        const response = await supertest(web)
        .delete("/api/users/logout")
        .set("Authorization", "salah");

        console.log(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    })
});