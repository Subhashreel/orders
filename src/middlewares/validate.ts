import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { BadRequestError } from '../utils/appError';

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.issues.map(
          i => `${i.path.join('.') || 'body'}: ${i.message}`
        );
        return next(new BadRequestError(messages.join(', ')));
      }
      next(err);
    }
  };

export const validateParams =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.issues.map(
          i => `${i.path.join('.') || 'params'}: ${i.message}`
        );
        return next(new BadRequestError(messages.join(', ')));
      }
      next(err);
    }
  };

export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.issues.map(
          i => `${i.path.join('.') || 'query'}: ${i.message}`
        );
        return next(new BadRequestError(messages.join(', ')));
      }
      next(err);
    }
  };
