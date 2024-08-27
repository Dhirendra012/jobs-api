const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError , BadRequestError } = require('../errors');


// We are using bcrypt to hash our password - In case if your database get hacked then 
// password will be leacked and it will be a greate loss ..
// const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    // const { name, email, password } = req.body;
    // // if(!name || !email || !password)
    // // { throw new BadRequestError('Please Proivide name , email and Password') }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password,salt);

    // const tempUser = { name , email , password: hashedPassword}

    const user = await User.create({...req.body});
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name}, token });
}

const login = async (req, res) => {
    const { email , password } = req.body;
    if(!email || !password)
    { throw new BadRequestError('Please provide email and password'); }

    const user = await User.findOne({ email });
    if(!user){ throw new UnauthenticatedError('Invalid Creadentials'); }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect)
    { throw new UnauthenticatedError('Invalid Credentials'); }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name : user.name } , token});
}
 
module.exports = {
    login,
    register
}