const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now()+(24*60*60*1000))
}
module.exports = cookieOptions