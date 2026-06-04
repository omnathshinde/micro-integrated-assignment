import sequelize, { tables } from "#src/app/database/index.js";

export { sequelize };
export const { User, Deal, Interest, Investment, InvestorPreference } = tables;
