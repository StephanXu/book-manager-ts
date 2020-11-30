import request from '@/utils/request'

interface LoginResponse {
    name: string;
    alias: string;
    roles: string[];
    token: string;
}
export function login(data: { username: string; password: string }) {
    return request.request<LoginResponse>({
        url: '/user/login',
        method: 'post',
        data
    }).then(res => res.data);
}

interface UserProfile {
    id: number;
    alias: string;
    username: string;
    avatar: string;
    birthday: Date;
    roles: string[];
    telephone: string;
}
export function getInfo() {
    return request.request<UserProfile>({
        url: '/user/profile',
        method: 'get',
        params: {}
    }).then(res => res.data);
}

export function logout() {
    return request({
        url: '/auth/sign-out',
        method: 'post'
    }).then(res => res.data);
}

export function getUserList() {
    return request({
        url: '/user/list',
        method: 'get'
    }).then(res => res.data);
}
export function updateUser(
    userName: string,
    userProfile: {
        userName: string;
        password: string;
        alias: string;
        roles: string[];
    }) {
    return request({
        url: `/user/${userName}`,
        method: 'put',
        data: userProfile
    }).then(res => res.data);
}

export function registerUser(userInfo: { userName: string; password: string; alias: string }) {
    return request({
        url: '/user/register',
        method: 'post',
        data: userInfo
    }).then(res => res.data);
}

export function changePassword(changePasswordRequest: { oldPassword: string; newPassword: string }) {
    return request({
        url: '/user/change-password',
        method: 'patch',
        data: changePasswordRequest
    }).then(res => res.data);
}
