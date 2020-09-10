if (process.env.NODE_ENV != 'production') require('dotenv').config();

function refreshTokenCookieGetExpirationTime(){
    return new Date(Date.now() + 24 * 3600000);
}

function accessTokenCookieGetExpirationTime(){
    new Date(Date.now() + (60 * 15000))
}

module.exports = {
    DATABASE: process.env.DB_URI,
    PORT: process.env.PORT,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET,
    refreshTokenCookieGetExpirationTime,
    accessTokenCookieGetExpirationTime,

};