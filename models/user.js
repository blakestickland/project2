// Requiring bcrypt for password hashing.
const bcrypt = require("bcryptjs");
//requiring npm package for health calculations
const calculate = require("fitness-health-calculations");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNUll: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      alowNull: false,
      validate: {
        isNumeric: true
      }
    },
    height: {
      type: DataTypes.DECIMAL(10, 2),
      alowNull: false,
      validate: {
        isNumeric: true
      }
    },
    age: {
      type: DataTypes.INTEGER,
      alowNull: false,
      validate: {
        max: 120,
        min: 18,
        isNumeric: true
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNUll: false
    },
    diet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    goal: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idealWeight: {
      type: DataTypes.INTEGER
    },
    idealCalories: {
      type: DataTypes.INTEGER
    }
  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", user => {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  User.addHook("beforeCreate", user => {
    const idealBodyWeight = calculate.idealBodyWeight(
      parseInt(user.height),
      user.gender
    );
    user.idealWeight = idealBodyWeight;
  });

  User.addHook("beforeCreate", user => {
    console.log("value for user.activity", user.activity);
    const totalCaloricNeeds = calculate.caloricNeeds(
      user.gender,
      parseInt(user.age),
      parseInt(user.height),
      parseInt(user.weight),
      user.activity,
      user.goal,
      "normal"
    );
    user.idealCalories = totalCaloricNeeds;
  });

  // // eslint-disable-next-line prettier/prettier
  User.associate = models => {
    User.hasMany(models.Dailylog, {
      // eslint-disable-next-line prettier/prettier
      onDelete: "cascade",
    });
  };

  return User;
};
