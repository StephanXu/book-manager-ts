import { Router, Request, Response } from 'express'
import { User } from '../entity/user';
import { IUserRequest } from '../types/request'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Binary } from 'typeorm';

const saltRounds = 10;
const router = Router();

type registerRequest = {
    name: string;
    username: string;
    password: string;
    avatar: string;
    birthday: Date;
    telephone: string;
};

type loginRequest = {
    username: string,
    password: string
};

router.route('/')
    .get(async (req: Request, res: Response) => {
        res.json(await User.find());
    })
    .post(async (req: Request, res: Response) => {
        let registerInfo: registerRequest = req.body;
        let newUser = new User;
        Object.assign(newUser, registerInfo);
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);
        newUser.role = "member";
        await newUser.save();
        res.json(newUser);
    });

router.route('/login')
    .post(async (req: Request, res: Response) => {
        let loginInfo: loginRequest = req.body;
        let user = await User.findOne({ where: { username: loginInfo.username } });
        if (!user) {
            res.status(404).json({ msg: "user dose not exist" });
            return;
        }
        if (bcrypt.compare(loginInfo.password, user.password)) {
            const token = jwt.sign(
                {
                    uid: user.id,
                    role: user.role
                },
                'book-manager',
                {
                    expiresIn: 3600 * 24 * 3
                });
            res.json({
                name: user.username,
                alias: user.name,
                roles: [user.role],
                token: token
            });
        } else {
            res.status(403).json({ msg: "failed" });
        }
    });

interface UserProfile {
    id: number;
    alias: string;
    username: string;
    avatar: string;
    birthday: Date;
    roles: string[];
    telephone: string;
}
router.route('/profile')
    .get(async (req: IUserRequest, res: Response) => {
        let user = await User.findOne({ where: { id: req.user?.uid } })
        if (!user) {
            res.status(404).json({ msg: "User dose not exist" });
            return;
        }
        let profile: UserProfile = {
            id: user.id,
            alias: user.name,
            username: user.username,
            avatar: user.avatar,
            birthday: user.birthday,
            roles: [user.role],
            telephone: user.telephone
        }
        res.json(profile)
    })

export default router;
