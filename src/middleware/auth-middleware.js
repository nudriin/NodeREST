import { prismaClient } from "../app/database.js";

// membuat authetication middleware
const authMiddleware = async (req, res, next) => {
    const token = req.get("Authorization"); // ! mengambil token dari headernya
    if (!token) {
        // ! jika tidak ada tokennya maka akan di tolak requestnya
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        const user = await prismaClient.user.findFirst({
            where: {
                token: token
            }
        });
        if (!user) {
            res.status(401).json({
                errors: "Unauthorized"
            }).end();
        } else {
            // !  menambah data user ke request agar nantinya req.user dapat di pakai dan tidak undefined
            req.user = user; // * ini akan berisi object user
            next();
        }
    }
}

export {
    authMiddleware
}