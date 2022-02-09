const mobileRegex =
  /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/;

module.exports = (sequelize, DataTypes) => {
  const ContactDetails = sequelize.define("ContactDetails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: mobileRegex,
          msg: "please enter valid phone number",
        },
      },
    },
    emergency_contact_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  ContactDetails.associate = (models) => {
    ContactDetails.hasOne(models.User, {
      foreignKey: "contactId",
    });
    ContactDetails.belongsTo(models.AddressDetails, {
      foreignKey: "addressId",
    });
  };
  return ContactDetails;
};
