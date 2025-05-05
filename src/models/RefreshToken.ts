import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface RefreshTokenAttributes {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RefreshTokenCreationAttributes
  extends Optional<RefreshTokenAttributes, "id" | "createdAt" | "updatedAt"> {}

export class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  public id!: number;
  public userId!: number;
  public token!: string;
  public expiresAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
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
