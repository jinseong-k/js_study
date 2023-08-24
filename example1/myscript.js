const BOOK_STATUS_OK = 1;
const BOOK_STATUS_CHECKOUT = 2;
const BOOK_STATUS_DELAY = 3;

const PROCESS_OK = 1;
const PROCESS_FAIL = 0;

/**
 *  대여 정보를 도서관이 알아야 하지 않나
 *  책 - 사용자 맵..?
 *  책은 책 그 자체로만 있어야 할것같은데..
 *  책에도 사용자 정보가 있으니까 뭔가 복잡함
 *  하고 보니 뭔가 C 스럽기도 하고..
 */

class Book {
    title;
    author;
    isbn;
    _status;
    _user;

    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.status = BOOK_STATUS_OK;
        this._user = null;
    }

    get title() {
        return this.title;
    }

    set title(title) {
        this.title = title;
    }

    get status() {
        return this._status;
    }

    set status(status) {
        this._status = status;
    }

    get user() {
        return this._user;
    }

    set user(user) {
        this._user = user;
    }

    /**
     * 책의 isbn 값을 비교
     * @param {*} book1 비교할 책1
     * @param {*} book2 비교할 책2
     * @returns {number} 같을 경우 true / 다를 경우 false
     */
    static compareBook(book1, book2) {
        return (book1.isbn === book2.isbn) ? true : false;
    }

    /**
     * 책을 빌림 처리
     * @param {*} user 책을 빌려가는 사용자
     * @returns {number} 성공:1 / 실패:0
     */
    borrow(user) {
        if (this._status === BOOK_STATUS_CHECKOUT) {
            console.log(`${this.title}은/는 이미 대여중입니다.`);
            return PROCESS_FAIL; 
        }
        // status가 이미 대여중이면, 대여 처리 불가
        this._status = BOOK_STATUS_CHECKOUT;
        this._user = user;
        console.log(`책 대여 title : ${this.title} / user name : ${this._user.name}`);
        return PROCESS_OK;
    }

    /**
     * 책을 반납 처리함
     * @param {*} user 책을 반납처리하는 사용자
     * @returns {number} 성공:1 / 실패:0
     */
    returnBook(user) {
        if ((this._user !== user) || (this._status === BOOK_STATUS_OK)) {
            console.log(`${this.title}은/는 아직 대여상태가 아닙니다.`);
            return PROCESS_FAIL;
        }
        // user가 안맞거나, 상태가 대여중인 상태가 아닐 경우 반납처리 불가
        console.log(`책 반납 title : ${this.title} / user name : ${this._user.name}`);
        this._status = BOOK_STATUS_OK;
        this._user = null;
        return PROCESS_OK;
    }
}

class Library {
    users = [];
    books = [];

    /**
     * 도서관이 책을 보유하고 있는지 확인한다.
     * @param {*} book 도서관에 있는지 확인할 책
     * @returns {boolean} 보유:true / 미보유:false
     */
    _hasBook = (book) => {
        return this.books.includes(book);
    }

    /**
     * 도서관에 사용자가 등록되어 있는지 확인
     * @param {*} user 도서관에 등록되었는지 확인할 사용자
     * @returns {boolean} 등록:true / 미등록:false
     */
    _hasUser = (user) => {
        return this.users.includes(user);
    }

    /**
     * 도서관에서 책을 빌린다.
     * @param {*} user 책을 빌리는 사용자
     * @param {*} book 빌릴 책
     * @returns {number} 성공:1 / 실패:0
     */
    borrow = (user, book) => {
        if (this._hasBook(book) && this._hasUser(user)) {
            return book.borrow(user);
        }
        console.log(`등록되지 않은 사용자(${user.name}) 또는 등록되지 않은 책(${book.title})입니다.`);
        return PROCESS_FAIL;
    }

    /**
     * 도서관에 책을 반납한다.
     * @param {*} user 반납하는 사용자
     * @param {*} book 반납할 책
     * @returns {number} 성공:1 / 실패:0
     */
    returnBook = (user, book) => {
        if (this._hasBook(book) && this._hasUser(user)) {
            return book.returnBook(user);
        }
        console.log(`등록되지 않은 사용자(${user.name}) 또는 등록되지 않은 책(${book.title})입니다.`);
        return PROCESS_FAIL;
    }

    /**
     * 도서관에 책 추가
     * @param {*} book 추가할 책
     */
    addBook = (book) => {
        this.books.push(book);
    }

    /**
     * 도서관에 사용자 추가
     * @param {*} user 추가할 사용자
     */
    addUser = (user) => {
        this.users.push(user);
    }
}

class User {
    name;
    id;
    bookList = [];

    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

    /**
     * 사용자가 대여중인 책 리스트를 출력
     * @returns {*} 사용자가 대여중인 책 리스트
     */
    showMyBooks = () => {
        console.log(`--- [${this.name}] Book Information ---`);
        let index = 1;
        for (let book of this.bookList) {
            console.log(` ${index}.\n title: ${book.title}\n author: ${book.author}\n ISBN: ${book.isbn}`);
            index++;
        }
        console.log(`---------------------------------------`);
        return this.bookList;
    }

    /**
     * 사용자가 대여한 책 리스트에 추가
     * @param {*} book 추가할 책
     */
    addMyBook = (book) => {
        this.bookList.push(book);
    }

    /**
     * 사용자가 대여중인 책 리스트에서 반납처리
     * @param {*} book 반납처리할 책
     */
    removeMyBook = (book) => {
        let index = 0;
        index = this.bookList.indexOf(book);
        if (index !== -1) {
            this.bookList.splice(index, 1);
        }
    }

    /**
     * User가 도서관에서 책을 빌림
     * @param {*} library 도서관
     * @param {*} book 대여할 책
     * @returns {number} 성공:1 / 실패:0
     */
    borrow = (library, book) => {
        if (library.borrow(this, book)) {
            this.addMyBook(book);
            return PROCESS_OK;
        }
        console.log("User : 대여 처리 실패");
        return PROCESS_FAIL;
    }

    /**
     * User가 도서관에 책을 반납함
     * @param {*} library 도서관
     * @param {*} book 반납할 책
     * @returns {number} 성공:1 / 실패:0
     */
    returnBook = (library, book) => {
        if (library.returnBook(this, book)) {
            this.removeMyBook(book);
            return PROCESS_OK;
        }
        console.log("User : 반납 처리 실패");
        return PROCESS_FAIL;
    }
}

/* 진입? main script? 뭐라고 하지? */

/* 객체 인스턴스 생성 */
let library = new Library();

let goodBook = new Book("GoodBook", "Kim", "12-34512-34-1");
let niceBook = new Book("NiceBook", "Lee", "10-2345691-0");
let badBook = new Book("BadBook","Noh", "23-12323-21-9");

let kim = new User("Kim", "Jinseong");
let lee = new User("Lee", "Jinseong");

/* 이것저것 */
library.addUser(kim);  // 사용자 등록
library.addBook(goodBook);  // 책 등록
library.addBook(niceBook);

kim.borrow(library, goodBook);  // user가 book을 library에서 빌리기
lee.borrow(library, niceBook);  // 등록되지 않은 사용자가 빌리기 시도 (실패)

library.addUser(lee);

lee.borrow(library, goodBook);  // 이미 빌려간 책을 빌리기 시도 (실패)
kim.borrow(library, niceBook);
kim.borrow(library, badBook);  // 등록되지 않은 책 빌리기 시도 (실패)

library.addBook(badBook);

kim.showMyBooks();  // user가 빌린 책 목록 확인
kim.returnBook(library, goodBook);  // 반납하기
kim.returnBook(library, badBook);  // 안빌린 책 반납하기 (실패)

console.log("반납 후");

console.log(library);
console.log(goodBook);
console.log(kim);
console.log(lee);