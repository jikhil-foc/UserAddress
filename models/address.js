module.exports = (sequelize, DataTypes) => {
  const AddressDetails = sequelize.define("AddressDetails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    address_line_1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_line_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.ENUM({ values: ["INDIA", "USA", "UK"] }),
      allowNull: true,
    },
  });

  AddressDetails.associate = (models) => {
    AddressDetails.hasOne(models.ContactDetails, {
      foreignKey: "addressId",
    });
  };

  return AddressDetails;
};
