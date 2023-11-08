const userModel = require("../model/userModel");
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

const createUser = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const existingUserName = await userModel.findOne({ name });
    const existingUserEmail = await userModel.findOne({ email });
    if(existingUserName== null && existingUserEmail==null){
      const nameValidationMessage = validateName(name);
    if (nameValidationMessage !== "Name is valid") {
      return res.status(400).json({ error: nameValidationMessage });
    }

    const emailValidationMessage = validateEmail(email);
    if (emailValidationMessage !== "Email is valid") {
      return res.status(400).json({ error: emailValidationMessage });
    }

    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage !== "Password is valid") {
      return res.status(400).json({ error: passwordValidationMessage });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: passwordHash,
    });

    newUser.save();

    return res
      .status(201)
      .json({ message: "User created successfully", newUser });
    }
    else{
      return res
      .status(201)
      .json({ message: "User already exists"});
    }
    } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const updateUser = async (req, res) => {
  const { name, password } = req.body;
  const userId = req.params.id;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const nameValidationMessage = validateName(name);
    if (nameValidationMessage !== "Name is valid") {
      return res.status(400).json({ error: nameValidationMessage });
    }

    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage !== "Password is valid") {
      return res.status(400).json({ error: passwordValidationMessage });
    }

    user.name = name;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    user.password = passwordHash;

    await user.save();

    return res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update user details" });
  }
};


const deleteUser = async(req,res)=>{
  const emaill = req.body.email;

  try{
    const user = await userModel.findOneAndDelete({email: emaill});
    if(user){
      return res.status(200).json({ message: "User successfully deleted" });
    }
    else{
      return res.status(200).json({ message: "User does not exist" })
    };
  }
  catch(error){
    return res.status(500).json({ error: "Failed to delete user details" });
  }
};

function validateName(name) {
  if (!name) {
    return "Name is required";
  }
  if (name.length < 3) {
    return "Name should be at least 3 characters long.";
  }
  if (name.length > 20) {
    return "Name can't exceed 20 characters";
  }
  const alphabeticPattern = /^[a-zA-Z ]*$/;;
  if (!alphabeticPattern.test(name)) {
    return "Name should contain only alphabetic characters";
  }
  return "Name is valid";
}

function validateEmail(email) {
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  if (!email) {
    return "Email is required";
  }
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  return "Email is valid";
}

function validatePassword(password) {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (password.length > 30) {
    return "Password cannot exceed 30 characters.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one digit.";
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  if (/\s/.test(password)) {
    return "Password should not contain spaces.";
  }
  return "Password is valid";
}


module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
