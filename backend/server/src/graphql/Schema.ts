import "./Types.js";
import "./Resolvers.js";
import { builder } from "../builder.js";

export const schema = builder.toSchema();
