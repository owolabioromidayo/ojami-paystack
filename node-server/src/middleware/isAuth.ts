
import { NextFunction, Request, Response } from 'express';
import { Redis } from 'ioredis';
import { EntityManager } from '@mikro-orm/core';
import { RequestWithContext } from '../types';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userid) {
        return res.status(401).json({ errors: [{ field: 'auth', message: 'Not authenticated' }] });
    }
    next();
};