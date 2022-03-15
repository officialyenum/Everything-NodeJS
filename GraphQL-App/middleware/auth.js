const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
}

// module.exports = (req, res, next) => {

//     console.log(req.headers.authorization);
//     let authToken = req.headers.authorization
//     console.log(authToken);
//     if (authToken && authToken !== null) {
//         let token;
//         let decodedToken
//         try {
//             token = authToken.split(' ')[1]
//             decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
//             req.userId = decodedToken.userId;
//             req.isAuth = true;

//         } catch (e) {
//             console.log(e);
//             console.log(token);
//             console.log(decodedToken);
//             console.warn('Invalid token detected.');
//             req.userId = null;
//             req.isAuth = false;
//         }
//     } else {
//         req.userId = null;
//         req.isAuth = false;
//     }
//     next()
// }

// module.exports = (req, res, next) => {
//     const authHeader = req.get('Authorization');
//     req.isAuth = false;
//     if (!authHeader) {
//         const error = new Error('No Token Present');
//         error.code = 401;
//         throw error;
//     }

//     const token = authHeader.split(" ")[1];
//     let decodedToken;
//     try {
//         decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
//     } catch (err) {
//         const error = new Error('Not Authorized');
//         error.code = 401;
//         throw error;
//     }

//     if (!decodedToken) {
//         const error = new Error('Not Authorized');
//         error.code = 401;
//         throw error;
//     }
//     req.userId = decodedToken.userId;
//     req.isAuth = true;
//     next();
// }