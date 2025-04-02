import { Municipality } from "../models/municipality";
import { Package } from "../models/package";
import { Price } from "../models/price";

export const seedDb = async () => {
  await Package.destroy({ truncate: true });

  await Package.bulkCreate(
    [
      { name: "basic", priceCents: 20_000 },
      { name: "plus", priceCents: 59_900 },
      { name: "premium", priceCents: 111_100 },
    ],
    { validate: true }
  );

  await Municipality.bulkCreate(
    [{ name: "Göteborg" }, { name: "Stockholm" }, { name: "Solna" }],
    { validate: true }
  );

  const basic = (await Package.findOne({
    where: { name: "basic" },
  })) as Package;
  const plus = (await Package.findOne({ where: { name: "plus" } })) as Package;
  const premium = (await Package.findOne({
    where: { name: "premium" },
  })) as Package;

  await Price.bulkCreate(
    [
      { priceCents: 5000, packageId: basic.id },
      { priceCents: 10_000, packageId: basic.id },
    ],
    { validate: true }
  );

  await Price.bulkCreate(
    [
      { priceCents: 19_990, packageId: plus.id },
      { priceCents: 29_900, packageId: plus.id },
      { priceCents: 39_900, packageId: plus.id },
    ],
    { validate: true }
  );

  await Price.bulkCreate(
    [
      { priceCents: 55_000, packageId: premium.id },
      { priceCents: 66_600, packageId: premium.id },
      { priceCents: 77_700, packageId: premium.id },
      { priceCents: 88_800, packageId: premium.id },
    ],
    { validate: true }
  );

  // add prices based on municipalities
  const goteborg = (await Municipality.findOne({
    where: { name: "Göteborg" },
  })) as Municipality;
  const stockholm = (await Municipality.findOne({
    where: { name: "Stockholm" },
  })) as Municipality;
  const solna = (await Municipality.findOne({
    where: { name: "Solna" },
  })) as Municipality;

  await Price.bulkCreate(
    [
      {
        priceCents: 55_000,
        packageId: premium.id,
        municipalityId: goteborg.id,
      },
      {
        priceCents: 65_000,
        packageId: premium.id,
        municipalityId: stockholm.id,
      },
      {
        priceCents: 60_000,
        packageId: premium.id,
        municipalityId: solna.id,
      },
      {
        priceCents: 35_000,
        packageId: basic.id,
        municipalityId: goteborg.id,
      },
      {
        priceCents: 45_000,
        packageId: basic.id,
        municipalityId: stockholm.id,
      },
      {
        priceCents: 40_000,
        packageId: basic.id,
        municipalityId: solna.id,
      },
      {
        priceCents: 40_000,
        packageId: plus.id,
        municipalityId: goteborg.id,
      },
      {
        priceCents: 50_000,
        packageId: plus.id,
        municipalityId: stockholm.id,
      },
      {
        priceCents: 45_000,
        packageId: plus.id,
        municipalityId: solna.id,
      },
    ],
    { validate: true }
  );
};
