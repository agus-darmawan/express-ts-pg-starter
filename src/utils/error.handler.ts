import { Response } from "express";
import { BaseError } from "../middlewares/error.middleware";

export const handleError = (error: any, res: Response) => {
  const statusCode = error instanceof BaseError ? error.statusCode : 500;
  res.status(statusCode).json({
    message: error.message,
    status: statusCode,
    success: false,
  });
};
