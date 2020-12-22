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

export class UserProfile {
    id = 0;
    alias = '';
    username = '';
    avatar = '';
    birthday = new Date;
    roles: string[] = [];
    telephone = '';
}
export function getInfo() {
    return request.request<UserProfile>({
        url: '/user/profile',
        method: 'get',
        params: {}
    }).then(res => res.data);
}

export function getUserList() {
    return request.request<UserProfile[]>({
        url: '/user',
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

export class RegisterRequest {
    name = '';
    username = '';
    password = '';
    avatar = '';
    birthday = new Date;
    telephone = '';
}
export function registerUser(userInfo: RegisterRequest) {
    return request({
        url: '/user',
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

export function fetchRandomUser() {
    return request({
        url: 'https://randomuser.me/api/',
        method: 'get'
    }).then(res => res.data);
}

export function changeUserRole(userId: number, roles: string[]) {
    return request({
        url: `/user/${userId}/roles`,
        method: 'put',
        data: {
            roles
        }
    }).then(res => res.data);
}

export function removeUser(userId: number) {
    return request({
        url: `/user/${userId}`,
        method: 'delete'
    }).then(res => res.data);

}