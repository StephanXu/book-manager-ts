import { Router, Request, Response } from 'express'
import { User } from '../entity/user'
import { IUserRequest } from '../types/request'
import { Book } from '../entity/books'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { getManager } from 'typeorm'

const saltRounds = 10;
const router = Router();

interface RegisterRequest {
    name: string;
    username: string;
    password: string;
    avatar: string;
    birthday: Date;
    telephone: string;
};

interface LoginRequest {
    username: string,
    password: string
};

interface UserProfile {
    id: number;
    alias: string;
    username: string;
    avatar: string;
    birthday: Date;
    roles: string[];
    telephone: string;
}

interface ChangeUserRoleRequest {
    roles: string[];
}

async function listUsers(req: Request, res: Response) {
    let users = await User.find({
        order: {
            id: 'DESC'
        }
    });
    let usersProfile = users.map(user => {
        return <UserProfile>{
            id: user.id,
            alias: user.name,
            username: user.username,
            avatar: user.avatar,
            birthday: user.birthday,
            roles: [user.role],
            telephone: user.telephone
        };
    });
    res.json(usersProfile);
}

async function registerUser(req: Request, res: Response) {
    let registerInfo: RegisterRequest = req.body;
    let newUser = new User;
    Object.assign(newUser, registerInfo);
    newUser.password = await bcrypt.hash(newUser.password, saltRounds);
    newUser.role = "member";
    await newUser.save();
    res.json(newUser);
}

async function login(req: Request, res: Response) {
    let loginInfo: LoginRequest = req.body;
    let user = await User.findOne({ where: { username: loginInfo.username } });
    if (!user) {
        res.status(404).json({ msg: "user dose not exist" });
        return;
    }
    if (await bcrypt.compare(loginInfo.password, user.password)) {
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
}

async function getProfile(req: IUserRequest, res: Response) {
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
}

async function listBorrowedBook(req: IUserRequest, res: Response) {
    let user = await User.findOne({
        where: { id: req.user?.uid },
        relations: ['book']
    });
    if (!user) {
        res.status(404).json({ msg: 'User dose not found' });
        return;
    }
    let books = await Book.find({
        where: { reader: user },
        relations: ['author', 'library']
    });
    res.status(200).json(books);
}

async function changeUserRoles(req: IUserRequest, res: Response) {
    let user = await User.findOne({
        where: { id: req.params.userId }
    });
    if (!user) {
        res.status(404).json({ msg: 'User dose not found' });
        return;
    }
    let userRoleRequest: ChangeUserRoleRequest = req.body;
    if (userRoleRequest.roles.length < 1) {
        res.status(400).json({ msg: 'Bad params' })
        return;
    }
    user.role = userRoleRequest.roles[0];
    user.save();
    res.status(200).send();
}

async function removeUser(req: IUserRequest, res: Response) {
    let user = await User.findOne({
        where: { id: req.params.userId },
        relations: ['book', 'borrowRecord']
    });
    if (!user) {
        res.status(404).json({ msg: "User dose not exist" });
        return;
    }
    if (user.book.length) {
        res.status(400).json({ msg: "User did not return all books" });
        return;
    }
    await getManager().transaction(async transactionalEntityManager => {
        user?.borrowRecord.forEach(async (item) => {
            await transactionalEntityManager.remove(item);
        });
        await transactionalEntityManager.remove(user);
    });
    res.status(200).send();
}

router.route('/')
    .get(listUsers)
    .post(registerUser);

router.route('/login')
    .post(login);

router.route('/profile')
    .get(getProfile)

router.route('/book')
    .get(listBorrowedBook);

router.route('/:userId/roles')
    .put(changeUserRoles);

router.route('/:userId')
    .delete(removeUser);

export default router;
