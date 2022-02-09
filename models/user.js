const userNameRegex = "^[a-zA-Z0-9_.-]*$";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: userNameRegex,
          msg: "The Username must contain only A-Z. a-z, numbers and underscores",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [6, 128],
          msg: "Email address must be between 6 and 128 characters in length",
        },
        isEmail: {
          msg: "Email address must be valid",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  User.associate = (models) => {
    User.belongsTo(models.ContactDetails, {
      foreignKey: "contactId",
    });
  };
  return User;
};
