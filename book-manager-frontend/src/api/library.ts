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
    })
}