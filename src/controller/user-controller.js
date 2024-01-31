import userService from "../service/user-service.js"
// error handling 
const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        // Buat responsenya 200 dan balikan response body successnya berupa result
        res.status(200).json({
            data : result
        })
    } catch (e) {
        // jika error maka akan di kirim middleware error
        next(e);
    }
}

const login = async(req, res, next) => {
    try{
        const result = await userService.login(req.body);

        res.status(200).json({
            data : result
        })
    } catch(e) {
        next(e);
    }
}

const get = async(req, res, next) => {
    try {
        const username = req.user.username; // get data username dari object user 
        const result = await userService.getUser(username);
        
        res.status(200).json({
            data : result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const username = req.user.username; // * ambil data dari tokennya
        const request = req.body; // * ambil data dari reuquest body
        request.username = username; // * tambahkan property username
        const result = await userService.updateUser(request);
        res.status(200).json({
            data : result
        })
    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        await userService.logout(req.user.username);
        res.status(200).json({
            data : "OK"
        })
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    get,
    update,
    logout
}