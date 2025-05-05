import { Response, Request } from "express";

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: `Not Found for route ${req.originalUrl}`,
    status: 404,
    success: false,
  });
};
