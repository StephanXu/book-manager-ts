import request from '@/utils/request'

interface Library {
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


interface Author {
    id: number;
    name: string;
    book: Book[];
}
interface Book {
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


interface BorrowRecord {
    id: number;
    book: Book;
    reader: string;
    direction: Boolean; // true for borrowi
    time: Date;
}
export function listBorrowRecord(bookId: number) {
    return request.request<BorrowRecord[]>({
        url: `/book/${bookId}/record`,
        method: 'get'
    })
}