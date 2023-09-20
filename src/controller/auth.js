const User = require('../modals/user')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')

exports.signup = async (req,res) => {

    
    const {firstName,lastName,email,password} = req.body;

    try
    {
        const user = await User.findOne({email: email})

        if(user){
            return res.status(400).json({message:'User already registered'})
        }

        const new_user = new User({
            firstName,
            lastName,
            email,
            password,
            username: Math.random().toString()
        })

        await new_user.save()

        console.log("New User: ",new_user);

        res.status(201).json({message:"User registered Successfully"})     
        
    }
    catch(err){

        res.status(409).json({message: "Error Found"});
    }
}


exports.signin = async (req,res) => {

    try
    {
        const user = await User.findOne({email: req.body.email})
        if(user){

            const con = await user.authenticate(req.body.password)

            console.log(con)
            if(con)
            {
                const token = await jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'})

                const {_id, firstName, lastName, email, role, fullname} = user;
                
                res.status(200).json({
                    token,
                    user:
                    {
                        _id, firstName, lastName, email, role, fullname
                    }
                })
            }
            else
            {
                res.status(400).json({message:"Invalid Password"})     
            }
        }
    }
    catch(error){
        
        res.status(409).json({message: "Error Found"});
    }
   
}
