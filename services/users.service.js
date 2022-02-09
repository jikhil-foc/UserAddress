const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.User;

const passwordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

const mobileRegex =
  /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/;

exports.addUser = async (req, res) => {
  try {
    const { username, email, password, contactInfo } = req.body;

    // password format checking
    if (!passwordRegex.test(password)) {
      return res.status(409).json({
        message:
          "Password must contain atleast 1 capital letter,1 special character, 1 small letter",
      });
    }

    const emailExist = await User.findOne({ where: { email } });

    // checking Email Already Exist
    if (emailExist) {
      return res
        .status(409)
        .json({ message: "User with email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(password, salt);
    const userData = {
      username,
      email,
      password: encryptPassword,
      salt,
    };

    const savedUser = await User.create(userData);

    if (!savedUser) {
      return res.status(400).json({ message: "User Cannot be created" });
    }

    if (contactInfo) {
      if (!mobileRegex.test(contactInfo?.phone_number)) {
        return res.status(409).json({
          message: "Invalid mobile number ",
        });
      }

      const savedContact = await db.ContactDetails.create({
        phone_number: contactInfo?.phone_number,
        emergency_contact_user_id: contactInfo?.emergencyContactUser,
      });

      if (!savedContact) {
        return res.status(400).json({ message: "Contact Cannot be created" });
      }

      await db.User.update(
        { contactId: savedContact.id },
        { where: { id: savedUser.id } }
      );

      if (contactInfo?.address) {
        const savedAddress = await db.AddressDetails.create({
          address_line_1: contactInfo?.address?.addressLine1,
          address_line_2: contactInfo?.address?.addressLine2,
          state: contactInfo?.address?.state,
          country: contactInfo?.address?.country,
        });

        if (!savedAddress) {
          return res.status(400).json({ message: "Contact Cannot be created" });
        }

        await db.ContactDetails.update(
          { addressId: savedAddress.id },
          { where: { id: savedContact.id } }
        );
      }
    }

    if (savedUser) {
      res.json({
        message: "User Created Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    if (error?.errors) {
      res.status(400).json({
        message: error?.errors[0]?.message,
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
};

exports.getAllUsers = async (req, res) => {
  const usersList = await User.findAll({
    include: [{ model: db.ContactDetails, include: [db.AddressDetails] }],
  });
  res.json({
    usersList,
  });
};

exports.getUserDetailWithId = async (req, res) => {
  const id = req.params.id;
  const singleUser = await User.findByPk(id, {
    include: [{ model: db.ContactDetails, include: [db.AddressDetails] }],
  });
  if (!singleUser) {
    return res.status(404).json({ message: "No User Found with Id " + id });
  }
  res.json({
    user: singleUser,
  });
};
