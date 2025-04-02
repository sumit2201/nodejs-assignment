import {
  type Association,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelizeConnection } from "../db/config";
import { Price } from "./price";

class Municipality extends Model<
  InferAttributes<Municipality>,
  InferCreationAttributes<Municipality>
> {
  declare static associations: {
    prices: Association<Municipality, Price>;
  };

  declare id: CreationOptional<number>;
  declare name: string;
}

Municipality.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "municipalities",
  }
);

export { Municipality };
