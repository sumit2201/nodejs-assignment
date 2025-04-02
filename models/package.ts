import {
  type Association,
  type CreationOptional,
  DataTypes,
  ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
} from "sequelize";
import { sequelizeConnection } from "../db/config";
import { Price } from "./price";
import { Municipality } from "./municipality";

class Package extends Model<
  InferAttributes<Package>,
  InferCreationAttributes<Package>
> {
  declare static associations: {
    prices: Association<Package, Price>;
  };

  declare id: CreationOptional<number>;
  declare name: string;
  declare priceCents: number;
  declare prices?: NonAttribute<Price[]>;
  declare municipalityId: ForeignKey<Municipality["id"]> | null;
}

Package.init(
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
    priceCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    municipalityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true, // Set this to false if every package MUST have a municipality
      references: {
        model: Municipality,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Keep history intact even if the municipality is deleted
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "packages",
  }
);

Package.hasMany(Price, {
  sourceKey: "id",
  foreignKey: "packageId",
  as: "prices",
});

Package.belongsTo(Municipality, {
  foreignKey: "municipalityId",
});

export { Package };
