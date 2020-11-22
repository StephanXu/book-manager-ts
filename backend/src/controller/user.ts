import { Router, Request, Response } from 'express'
import { User } from '../entity/user';

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
        if (user.password == loginInfo.password) {
            res.status(200).json({ msg: "success" });
        } else {
            res.status(403).json({ msg: "failed" });
        }
    });

export default router;
