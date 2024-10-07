import express, { NextFunction, Request, Response } from "express";
import argon2 from "argon2";

import { validateRegister, validateNewPass } from "../utils/validation";

import { RequestWithContext } from "../types";
import { User } from "../entities/User";
import { populate } from "dotenv";

const router = express.Router();
const cookieName = process.env.COOKIE_NAME

router.post("/users/signup", registerUser);
router.post("/users/login", loginUser);
router.post("/users/logout", logoutUser);
router.post("/users/change_password", changePassword);
router.post("/users/forgot_password", forgotPassword);
router.get("/users/me", getCurrentUser);
router.get("/users/:id", getUser);



async function registerUser(req: Request, res: Response) {
    const { firstname, lastname, birthDate, phoneNumber, email, password } = req.body;

    const redis = (req as RequestWithContext).redis;
    const em = (req as RequestWithContext).em;

    // Validate user input
    const errors = validateRegister({ email, password });
    if (errors) {
        return res.status(400).json({ errors });
    }

    try {
        const hashedPassword = await argon2.hash(password);

        const user = new User(firstname, lastname, phoneNumber, email, hashedPassword);
        user.birthDate = birthDate;
        await em.fork({}).persistAndFlush(user);

        // Set the session and return the user
        req.session.userid = user.id;
        return res.status(201).json({ user });
    } catch (err: any) {
        if(err.code === "42P01"){
            return res.status(500).json({
                errors: [{
                    field: "missing tables",
                    message: "Relax, our servers will be back soon"
                }]
            })
        }else if(err.code === "23505"){
            return res.status(400).json({
                errors: [{
                    field: "duplicate contraint",
                    message: "Oops, a user already exists with some details here."
                }]
            })
        }
        // Handle errors
        return res.status(500).json({ errors: [{ field: 'Could not create user', message: err }] });
    }
}


async function loginUser(req: Request, res: Response) {
    const { phoneOrEmail, password } = req.body;

    const em = (req as RequestWithContext).em;
    if(!phoneOrEmail){
        return res.status(400).json({
            errors: [
                {
                    field: "phoneOrEmail",
                    message: "Fill in the form before you submit"
                }
            ]
        })
    }

    try {
        const user = await em.fork({}).findOneOrFail(
            User,
            phoneOrEmail.includes("@")
                ? { email: phoneOrEmail }
                : { phoneNumber: phoneOrEmail }
        );

        const valid = await argon2.verify(user.passwordHash, password);
        if (!valid) {
            return res.status(400).json({
                errors: [
                    {
                        field: "password",
                        message: "incorrect password",
                    },
                ],
            });
        }

        req.session.userid = user.id;
        return res.status(200).json({ user });
    } catch (e) {
        return res.status(400).json({
            errors: [
                {
                    field: "phoneOrEmail",
                    message: "Account does not exist",
                },
            ],
        });
    }
}


async function logoutUser(req: Request, res: Response) {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    errors: [{ field: 'Could not log out', message: 'An error occurred while logging user out, please try again' }]
                });
            }
            res.clearCookie(`${cookieName}`, { path: '/' });
            return res.status(200).json({ message: 'Logged out successfully' });
        });
    } else {
        return res.status(401).json({ message: 'User not authenticated.' });
    }
}

async function changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;

    const em = (req as RequestWithContext).em;

    if (!req.session.userid) {
        return res.status(401).json({ errors: [{ field: 'auth', message: 'Not authenticated' }] });
    }

    try {
        const user = await em.fork({}).findOneOrFail(User, { id: req.session.userid });

        const validOldPassword = await argon2.verify(user.passwordHash, oldPassword);
        if (!validOldPassword) {
            return res.status(400).json({
                errors: [
                    {
                        field: "oldPassword",
                        message: "Incorrect old password",
                    },
                ],
            });
        }

        user.passwordHash = await argon2.hash(newPassword);
        await em.fork({}).persistAndFlush(user);

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        return res.status(500).json({ errors: [{ field: 'Could not change password', message: err }] });
    }
}

async function forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    // TODO: Logic for sending reset password email
}

async function getUser(req: Request, res: Response) {
    const { id } = req.params;

    const userId = Number(id);
    console.log("getUser:", req.session.userid)

    // Check if the conversion resulted in a valid number
    if (isNaN(userId)) {
        return res.status(400).json({ errors: [{ field: 'id', message: 'Invalid user ID' }] });
    }


    const em = (req as RequestWithContext).em;

    try {
        const user = await em.fork({}).findOneOrFail(User, { id: userId });
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(404).json({ errors: [{ field: 'user', message: 'User not found' }] });
    }
}

async function getCurrentUser(req: Request, res: Response) {
    if (!req.session.userid) {
        return res.status(401).json({
            errors: [
                {
                    field: "auth",
                    message: "Not authenticated",
                },
            ],
        });
    }
    console.log("UserID:", req.session.userid)

    const em = (req as RequestWithContext).em;

    try {
        const user = await em.fork({}).findOneOrFail(User, { id: req.session.userid }, { populate: ["virtualWallet", "storefronts"]},);
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ errors: [{ field: 'Could not fetch user', message: err }] });
    }
}


export default router;


