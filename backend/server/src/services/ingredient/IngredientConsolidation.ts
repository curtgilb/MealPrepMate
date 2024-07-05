import { configureMeasurements } from "convert-units";

import length, {
  LengthSystems,
  LengthUnits,
} from "convert-units/definitions/length";

import volume, {
  VolumeSystems,
  VolumeUnits,
} from "convert-units/definitions/volume";

import mass, { MassSystems, MassUnits } from "convert-units/definitions/mass";

// Measures: The names of the measures being used
type Measures = "length" | "volume" | "mass";
// Systems: The systems being used across all measures
type Systems = LengthSystems | VolumeSystems | MassSystems;
// Units: All the units across all measures and their systems
type Units = LengthUnits | VolumeUnits | MassUnits;

export const convert = configureMeasurements<Measures, Systems, Units>({
  volume,
  mass,
  length,
});
