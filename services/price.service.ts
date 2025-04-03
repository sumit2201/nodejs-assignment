import { Op } from "sequelize";
import { Package } from "../models/package";
import { Price } from "../models/price";
import { Municipality } from "../models/municipality";

export default {
  async getPriceHistory(
    packageName: string,
    year: number,
    municipalityName?: string
  ) {
    // Find package by name
    const packageInstance = await Package.findOne({
      where: { name: packageName },
    });

    if (!packageInstance) {
      throw new Error(`Package '${packageName}' not found`);
    }

    // Build query conditions
    const whereCondition: any = {
      packageId: packageInstance.id,
      createdAt: {
        [Op.gte]: new Date(`${year}-01-01`), // Start of the year
        [Op.lt]: new Date(`${year + 1}-01-01`), // Start of next year
      },
    };

    // If municipalityName is provided, add it to the condition
    if (municipalityName) {
      const municipality = await Municipality.findOne({
        where: { name: municipalityName },
      });

      if (!municipality) {
        throw new Error(`Municipality '${municipalityName}' not found`);
      }

      whereCondition.municipalityId = municipality.id;
    }

    console.debug("check where condition", whereCondition);

    // Fetch prices with municipality
    const prices = await Price.findAll({
      where: whereCondition,
      include: [
        { model: Municipality, attributes: ["name"], as: "municipality" },
      ],
      order: [["createdAt", "ASC"]],
    });

    console.debug("check price data", JSON.stringify(prices));

    // Format result
    return prices.reduce((result: Record<string, number[]>, price) => {
      const muniName = price.municipality?.name ?? "Unknown";
      if (!result[muniName]) {
        result[muniName] = [];
      }
      result[muniName].push(price.priceCents);
      return result;
    }, {});
  },
};
