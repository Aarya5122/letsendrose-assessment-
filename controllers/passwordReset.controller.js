const User = require("../models/userSchema.model");
const CustomError = require("../utils/CustomError");
const asyncHandler = require("../utils/asyncHandler");

const passwordReset = asyncHandler(
    async (req, res)=>{
        const {oldPassword, newPassword} = req.body
        const { _id } = req.user
        if(!_id){
            throw new CustomError("user not logged in", 401);
        }

        try{
            const user = await User.findById(_id).select("+password");
            const isAuthenticated = await user.comparePassword(oldPassword)
            if(!isAuthenticated){
                throw new CustomError("Invalid credentials", 400)
            }
            user.password = newPassword
            await user.save()
            user.password = undefined

            res.status(200).json({
                success: true,
                message: "password updated successfully"
            })
        } catch(error){
            throw new CustomError("unauthenticated user", 400)
        }
    }
)

module.exports = passwordReset;
