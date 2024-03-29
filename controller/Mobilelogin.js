const Mobilelogin=require('../models/mobile')
const bcrypt =require('bcrypt')
const jwt=require('jsonwebtoken')
const keyvalue=process.env.KEY
const redisClient =require('../config/redis')
const { promisify } = require('util');
const { json } = require('express')

exports.create = async (req, res) => {
  try {
    const { UserName, Password, Status, Role } = req.body;
    
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(Password, 10);
    
    // Create a new Mobilelogin user
    const MobileUser = new Mobilelogin({
      UserName: UserName,
      Password: hashedPassword,
      Status: Status,
      Role: Role
    });
    
    // Save the new user to the database
    const savedUser = await MobileUser.save();
    console.log("data",savedUser)
    
    // // Generate a JWT token for the user
    // const token = jwt.sign({ user: savedUser }, keyvalue, { expiresIn: '24h' });

    res.status(200).json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// exports.login=async(req,res)=>{

//     try{
//      const data=await Mobilelogin.findOne({
//         UserName:req.body.UserName,
//         Password:req.body.Password,
//         Status:req.body.Status,
//         Role:req.body.Role

//      })

//      if(data){
//         data.Status= true;
//         const updated=await data.save();
//         console.log("updated",updated)

//         jwt.sign({data},keyvalue,{expiresIn:'24h'},(err,token)=>{
//             if(err){
//                 res.status(500).json({message:'Token generation error'})
//             }
//             else{
//                const decoded= jwt.decode(token);
//                const pastExpiration=Math.floor(Date.now()/1000)-3;
//                decoded.exp=pastExpiration
//                const expiredToken=jwt.sign(decoded,keyvalue);
//                res.status(200).json({
//                 Status:true,
//                 data:{_id:data._id,UserName:data.UserName,token,expiredToken},
//                 updatedSalesOrder:updated
//                })
//             }
//         })

//      }
//      else{
//         res.status(200).json({message:"No record Found"})
//      }
//     }
//     catch(err){
//       res.status(400).json({message:err.message})
//     }

// }

const getAsync = promisify(redisClient.get).bind(redisClient);
const setExAsync = promisify(redisClient.setex).bind(redisClient);

exports.get = async (req, res) => {
  try {
    const key = 'getdata';

    if (!redisClient.connected) {
      console.error('Redis Client is not connected');
      return res.status(500).json({
        message: 'Redis Client is not connected'
      });
    }

    const cachedData = await getAsync(key);

    if (cachedData) {
      console.log('Data retrieved from cache', JSON.parse(cachedData));
      return res.json({ data: JSON.parse(cachedData) });
    }

    const getData = await Mobilelogin.find({});

    if (getData.length > 0) {
      await setExAsync(key, 3600, JSON.stringify(getData));
      return res.json({ data: getData });
    } else {
      console.log('No data found');
      return res.status(404).json({ error: 'No data found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { UserName, Password , Role } = req.body;

    // Find the user by username in the database
    const user = await Mobilelogin.findOne({ UserName ,Role});
    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(Password, user.Password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, username: user.UserName }, keyvalue, { expiresIn: '24h' });

    res.status(200).json({
      status: true,
      data: {
        _id: user._id,
        UserName: user.UserName,
        Role:user.Role,
        token,
      },
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



