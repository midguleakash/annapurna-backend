const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN USER

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    //  Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    //  Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //  Response
    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      name: user.name,
      email:user.email,
      mobile:user.mobile
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// register user

exports.registerUser = async (req, res) => {
    try {
        const {name , email, password, role, mobile, address} = req.body ;

        // validation of user

        if(!name || !email || !password || !role || !mobile || !address ){
            return res.status(400).json({
                message:"Please fill all required field"
            });
        }


        // check existing user
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({
                message:"User already exists"
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // create user
        const user = new User({
            name,
            email,
            password:hashedPassword,
            role,
            mobile,
            address
        });


        await user.save();

        res.status(201).json({
            message:"User registered successfully"
        });
    } catch (error){
        console.error(error);
        res.status(500).json({
            message:"Server error"
        });
    }
};