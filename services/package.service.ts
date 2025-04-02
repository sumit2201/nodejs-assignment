import { sequelizeConnection } from "../db/config";
import { Municipality } from "../models/municipality";
import { Package } from "../models/package";
import { Price } from "../models/price";

export default {
  async getAll() {
    return await Package.findAll({
      include: [{ model: Price, as: "prices" }],
    });
  },
  async updatePackagePrice(
    pack: Package,
    newPriceCents: number,
    municipality: string | null = null
  ) {
    try {
      const newPackage = await sequelizeConnection.transaction(async (t) => {
        // Find the municipality if provided
        let municipalityInstance = null;
        if (municipality) {
          municipalityInstance = await Municipality.findOne({
            where: { name: municipality },
            transaction: t,
          });

          // If the municipality doesn't exist, create it
          if (!municipalityInstance) {
            municipalityInstance = await Municipality.create(
              { name: municipality },
              { transaction: t }
            );
          }

          // Update the package's municipality if changed
          if (pack.municipalityId !== municipalityInstance.id) {
            pack.municipalityId = municipalityInstance.id;
          }
        }
        if (municipality) {
          municipalityInstance = await Municipality.findOne({
            where: { name: municipality },
            transaction: t,
          });

          // If the municipality doesn't exist, create it
          if (!municipalityInstance) {
            municipalityInstance = await Municipality.create(
              { name: municipality },
              { transaction: t }
            );
          }

          // Update the package's municipality if changed
          if (pack.municipalityId !== municipalityInstance.id) {
            pack.municipalityId = municipalityInstance.id;
          }
        }

        // Log the price change in the Price table
        await Price.create(
          {
            packageId: pack.id,
            priceCents: pack.priceCents, // Store the old price as history
            municipalityId: pack.municipalityId || null,
          },
          { transaction: t }
        );

        // Update the package with the new price
        pack.priceCents = newPriceCents;
        return pack.save({ transaction: t });
      });

      return newPackage;
    } catch (err: unknown) {
      throw new Error("Error handling the transaction");
    }
  },

  async priceFor(packageName: string, municipalityName: string) {
    const foundPackage = await Package.findOne({
      where: { name: packageName },
      include: {
        model: Municipality,
        where: { name: municipalityName },
        required: true, // Ensures the package belongs to this municipality
      },
    });

    return foundPackage ? foundPackage.priceCents : null;
  },
};
