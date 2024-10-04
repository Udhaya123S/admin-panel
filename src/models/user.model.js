const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const User = sequelize.define('user', {
 
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
     trim:true
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,

    get() {
      const value = this.getDataValue('email');
      return value ? value.toLowerCase() : null;
    },  
    validate: {
      isEmail: {
        msg: 'Invalid email',
      },
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isValidPassword(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      len: {
        args: [8,],
        msg: 'Password must be at least 8 characters long',
      },
    },
  },

  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user' 
},

  status: {
    type: DataTypes.INTEGER, 
    defaultValue: 1, 
    allowNull: false,
    validate: {
      isIn: {
        args: [[0, 1]],
        msg: 'Status must be 0 (inactive) or 1 (active)',
      },
    },
  },
 
});

module.exports = User;