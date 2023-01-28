import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


/***REGISTER USER***/
export const register= async(req,res) => {
 try{
  const {
    /***from frontend we have to send these parameters****/
    firstName,
    lastName,
    email,
    password,
    picturePath,
    friends,
    location,
    occupation,
  } = req.body;

  /****we gonna use salt to encrypt our password***/
  const salt = await bcrypt.genSalt();

  const passwordHash = await bcrypt.hash(password,salt);
/*****the way the register function will work is we gonnna encrypt the password, save it and after we save it, when the user tries to log in we're gonna save that again and make sure if  it is correct one and give them a json web token******/
  const newUser = new User({
    firstName,
    lastName,
    email,
    password:passwordHash,
    picturePath,
    friends,
    location,
    occupation,
    viewedProfile:Math.floor(Math.random()*10000),
    impressions:Math.floor(Math.random()*10000), 
  });
  const savedUser = await newUser.save();
  /***res provided by express, 201 say something has been created, we wanna send user back to correct status so we use json(savedUser)*the frontend will receive this response**/
  res.status(201).json(savedUser);

 }catch(err){
    res.status(500).json({error:err.message});
 }
}





/****LOGGING IN *****/
export const login = async(req,res) => {
 try{
   const {email, password} = req.body;

   const user = await User.findOne({email:email});



/***this is what happens when user cannot be found or an improper email****/
   if(!user) return res.status(400).json({msg:"User cannot be found"})

/*******this is gonna determine if we n=match the password***********/
   const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) return res.status(400).json({msg:"Invalid credentials"}) 


  const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
/*****we're gonna delete the password so that it doesn't get sent back to the frontend*******/
  delete user.password;


  res.status(200).json({token,user});





 }  catch(err){
    res.status(500).json({error:err.message});
 }
}