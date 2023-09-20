const User = require('../../modals/user')
const jwt = require('jsonwebtoken')


exports.adminSignup = async (req,res) => {

    const {firstName,lastName,email,password} = req.body;

    try
    {
        const user = await User.findOne({email: email})

        if(user){
            return res.status(400).json({message:'Admin already registered'})
        }

        const new_user = new User({
            firstName,
            lastName,
            email,
            password,
            username: Math.random().toString(),
            role: 'admin'
        })

        await new_user.save()

        console.log("New User: ",new_user);

        res.status(201).json({message:"Admin registered Successfully"})     
        
    }
    catch(err){

        res.status(409).json({message: "Error Found"});
    }
}


exports.adminSignin = async (req,res) => {

    const user = await User.findOne({email: req.body.email})
    try
    {
        if(user){

            
            if(user.authenticate(req.body.password) && user.role === 'admin')
            {
                const token = jwt.sign({_id: user._id,
                    role:user.role}, process.env.JWT_SECRET, {expiresIn: '1h'})

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
