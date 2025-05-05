import { Response, Request } from "express";

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: `Not Found for route darr ${req.originalUrl}`,
    status: 404,
    success: false,
  });
};

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}
