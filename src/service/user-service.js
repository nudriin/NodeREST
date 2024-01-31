import { validate } from "../validation/validation.js"
import { userGetValidation, userLoginValidation, userRegistrationValidation, userUpdateValidation } from "../validation/user-validation.js"
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid"; // import uuid versi 4
const register = async (request) => {
    const user = validate(userRegistrationValidation, request);

    const countUser = await prismaClient.user.count({
        where : {
            username : user.username
        }
    });

    if(countUser === 1){
        throw new ResponseError(400, "Username is already exist");
    }

    // ! Hashing password menggunakan bcrypt 
    user.password = await bcrypt.hash(user.password, 10); // password, komplesitas hashing

    // TODO
    const result = await prismaClient.user.create({
        data : user,
        select : {
            username :true,
            name : true
        }
    });

    return result;
}

const login = async (request) => {
    const loginRequest = validate(userLoginValidation, request);

    // ! find user
    const user = await prismaClient.user.findUnique({
        where : {
            username : loginRequest.username
        },
        select : {
            username : true,
            password : true
        }
    });

    // ! cek user is exist?
    if(!user) {
        throw new ResponseError(401, "username or password wrong");
    }
    
    // ! cek apakah password valid
    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    
    if(!isPasswordValid){
        throw new ResponseError(401, "username or password wrong");
    }

    // ! membuat token baru
    const token = uuid().toString(); // membuat tokennya

    // ! update token ke database
    const result = await prismaClient.user.update({
        where : {
            username : loginRequest.username
        },
        data : {
            token : token
        }, 
        select : {
            token : true
        }
    });

    return result;

}

const getUser = async (username) => {
    const request = validate(userGetValidation, username);

    const user = await prismaClient.user.findUnique({
        where : {
            username : request
        }, 
        select : {
            username : true,
            name : true
        }
    });

    if(!user) {
        throw new ResponseError(404, "User not found");
    }

    return user;

}

const updateUser = async (request) => {
    const user = validate(userUpdateValidation, request);

    const countUser = await prismaClient.user.count({
        where : {
            username : user.username
        }
    });

    if(countUser !== 1) {
        throw new ResponseError(404, "User not found");
    }

    // buat data kosong yang digunakan untuk mengupdate
    const data = {}
    // ! Cek apakah requestnya ada property name 
    if(user.name) {
        data.name = user.name; // asign data.name equals user.name
    }

    // ! Cek apakah request mengandung password
    if(user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    const result = await prismaClient.user.update({
        where : {
            username : user.username
        },
        data : data,
        select : {
            username : true,
            name : true
        }
    });

    return result;
}

const logout = async (username) => {
    // divalidasi menggunakan userGetValidation
    const request = validate(userGetValidation, username);
    
    const user = await prismaClient.user.findUnique({
        where : {
            username : request
        }
    });

    if(!user) {
        throw new ResponseError(404, "User not")
    }

    const result = await prismaClient.user.update({
        where : {
            username : user.username
        },
        data : {
            token : null
        },
        select : {
            username : true
        }
    });

    return result;
}

export default {
    register,
    login,
    getUser,
    updateUser,
    logout
}