import { NextFunction, Request, Response } from 'express';
import { Redis } from 'ioredis';
import { EntityManager } from '@mikro-orm/core';
import { RequestWithContext } from '../types';


const contextMiddleware = (redis: Redis, em: EntityManager) => {
    return (req: Request, res: Response, next: NextFunction) => {
        (req as RequestWithContext).redis = redis;
        (req as RequestWithContext).em = em;
        next();
    };
};

export default contextMiddleware;