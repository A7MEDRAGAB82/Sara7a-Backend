import { NotFoundException } from "./response/index.js";


export const validateExists = async ({ model, filter, message = "Resource not found" }) => {
  const document = await model.findOne(filter);
  if (!document) {
    NotFoundException({ message });
  }
  return document;
};