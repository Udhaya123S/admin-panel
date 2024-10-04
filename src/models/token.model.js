const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Your Sequelize instance
const { tokenTypes } = require('../config/tokens');

const Token = sequelize.define('Token', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Assuming the table name for the `User` model is `Users`
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM(tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.EMAIL_VERIFICATION),
    allowNull: false,
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  blacklisted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,  // Sequelize automatically handles createdAt and updatedAt fields
  tableName: 'tokens',  // Optional: Explicitly define table name
});

// Define associations (assuming you have a `User` model)
Token.associate = (models) => {
  Token.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

module.exports = Token;
