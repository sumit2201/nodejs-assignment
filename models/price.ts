import {
  type CreationOptional,
  DataTypes,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelizeConnection } from "../db/config";
import { type Package } from "./package";
import { Municipality } from "./municipality";

class Price extends Model<
  InferAttributes<Price>,
  InferCreationAttributes<Price>
> {
  declare id: CreationOptional<number>;
  declare priceCents: number;
  declare packageId: ForeignKey<Package["id"]>;
  declare municipalityId: ForeignKey<Municipality["id"]> | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  public readonly municipality?: Municipality;
}

Price.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    priceCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "packages",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    municipalityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "municipalities",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnection,
    indexes: [
      {
        fields: ["packageId", "municipalityId", "createdAt"], // Composite index for faster lookups
      },
      {
        fields: ["packageId", "createdAt"], // If searching without municipality
      },
    ],
  }
);

Price.belongsTo(Municipality, {
  foreignKey: "municipalityId",
  as: "municipality",
});

export { Price };
