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
    municipality: string | null = null,
    date?: Date | null
  ) {
    try {
      return await sequelizeConnection.transaction(async (t) => {
        let municipalityInstance = null;

        if (municipality) {
          // Find or create the municipality record
          municipalityInstance = await Municipality.findOne({
            where: { name: municipality },
            transaction: t,
          });

          if (!municipalityInstance) {
            municipalityInstance = await Municipality.create(
              { name: municipality },
              { transaction: t }
            );
          }

          // Update the package's municipality if needed
          if (pack.municipalityId !== municipalityInstance.id) {
            pack.municipalityId = municipalityInstance.id;
          }
        }

        // Step 1: Create the price record with the old price
        await Price.create(
          {
            packageId: pack.id,
            priceCents: newPriceCents,
            municipalityId: pack.municipalityId || null,
            createdAt: date ?? new Date(),
          },
          { transaction: t }
        );

        // Step 2: Update the price of the package
        pack.priceCents = newPriceCents;

        // Save the updated package with the new price
        const updatedPack = await pack.save({ transaction: t });

        return updatedPack;
      });
    } catch (err) {
      console.error("Error in updatePackagePrice:", err); // This will log full error stack
      throw err; // Re-throw to let Jest catch it
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
