import { MeasurementUnit } from "@prisma/client";
import { db } from "../db.js";
import Fuse from "fuse.js";

export class UnitSearch {
  units: Fuse<MeasurementUnit> | undefined;
  options = {
    isCaseSensitive: false,
    keys: ["name", "abbreviations"],
  };

  constructor(units?: MeasurementUnit[]) {
    if (units) {
      this.units = new Fuse(units, this.options);
    }
  }

  async init() {
    const units = await db.measurementUnit.findMany({});
    this.units = new Fuse(units, this.options);
  }

  search(query: string): MeasurementUnit | undefined {
    if (!this.units) throw Error("UnitSearch not initialized");
    const results = this.units.search(query);
    return results.length > 0 ? results[0].item : undefined;
  }
}
