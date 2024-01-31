import { ResponseError } from "../error/response-error.js"

// Membuat error middleware
const errorMiddleware = async (err, req, res, next) => {
    // ! Jika tidak terjadi error maka langsung next saja
    if(!err) {
        next();
        return;
    }

    // ! cek apakah erronya dari response Error
    if (err instanceof ResponseError) {
        // responsenya adalah status dan message errornya
        res.status(err.status).json({
            errors: err.message
        });
        // Jika errornya dari validasi join
    } else {
        // jika bukan ResponseError maupun joi
        res.status(500).json({
            errors : err.message
        })
    }
}

export {
    errorMiddleware
}