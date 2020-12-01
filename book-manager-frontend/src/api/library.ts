import request from '@/utils/request'

export interface Library {
    id: number;
    name: string;
    position: string;
    Book: Book[];
}
export function listLibrary() {
    return request.request<Library[]>({
        url: '/library',
        method: 'get'
    }).then(res => res.data);
}
export function addLibrary(libraryInfo: { name: string; position: string }) {
    return request.request<Library>({
        url: '/library',
        method: 'post',
        data: libraryInfo
    }).then(res => res.data);
}
export function removeLibrary(libraryId: number) {
    return request({
        url: `/library/${libraryId}`,
        method: 'delete'
    }).then(res => res.data);
}

export interface Author {
    id: number;
    name: string;
    book: Book[];
}
export interface Book {
    id: number;
    title: string;
    author: Author[];
    library: Library;
    cover: string;
}
export function listBooks(libraryId: number) {
    return request.request<Book[]>({
        url: `/library/${libraryId}/book`,
        method: 'get'
    }).then(res => res.data);
}


export interface BorrowRecord {
    id: number;
    book: Book;
    reader: string;
    direction: boolean; // true for borrowi
    time: Date;
}
export function listBorrowRecord(bookId: number) {
    return request.request<BorrowRecord[]>({
        url: `/book/${bookId}/record`,
        method: 'get'
    }).then(res => res.data);
}

export class AddBookReq {
    title = '';
    author: string[] = [];
    library = 0;
    cover = '';
}
export function addBook(libraryId: number, book: AddBookReq) {
    return request({
        url: `/library/${libraryId}/book`,
        method: 'post',
        data: book
    }).then(res => res.data);
}

export function matchBook(bookName: string) {
    return request({
        url: `https://book.feelyou.top/search/${bookName}`,
        method: 'get'
    }).then(res => res.data);
}

export function getBorrowedBook() {
    return request.request<Book[]>({
        url: `/user/book`,
        method: 'get'
    }).then(res => res.data);
}

export function borrowBook(bookId: number, userId: number) {
    return request({
        url: `/book/${bookId}/reader/${userId}`,
        method: 'post'
    }).then(res => res.data);
}

export function returnBook(bookId: number, userId: number) {
    return request({
        url: `/book/${bookId}/reader/${userId}`,
        method: 'delete'
    }).then(res => res.data);
}

export function removeBook(bookId: number) {
    return request({
        url: `/book/${bookId}`,
        method: 'delete'
    }).then(res => res.data);
}