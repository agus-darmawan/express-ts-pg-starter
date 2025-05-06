import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class RefreshToken extends Model {
  public id!: number;
  public userId!: number;
  public token!: string;
  public expiresAt!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "RefreshToken",
    tableName: "refresh_tokens",
    timestamps: true,
  }
);

export default RefreshToken;
