import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { allBooks, allReaders } from 'app/data';
import { Reader } from "app/models/reader";
import { Book } from "app/models/book";
import { BookTrackerError } from 'app/models/bookTrackerError';
import { OldBook } from "app/models/oldBook";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http : HttpClient) { }

  mostPopularBook: Book = allBooks[0];

  setMostPopularBook(popularBook: Book): void {
    this.mostPopularBook = popularBook;
  }

  getAllReaders(): Reader[] {
    return allReaders;
  }

  getReaderById(id: number): Reader {
    return allReaders.find(reader => reader.readerID === id);
  }

  getAllBooks(): Observable<Book[] | BookTrackerError> {
    console.log('Get all books');
    return this.http.get<Book[]>('/api/books')
      .pipe(
        catchError(err => this.handleHttpError(err))
      );
  }

  handleHttpError(err: HttpErrorResponse): Observable<BookTrackerError> {
    let dataError = new BookTrackerError();

    dataError.errorNumber = 100;
    dataError.message = err.statusText;
    dataError.friendlyMessage = 'An error occured while retrieving data, please contact the help desk';

    return throwError(dataError);
  }

  getBookById(id: number): Observable<Book> {
    console.log(`get book ${id}`);
    //let getHeaders: HttpHeaders = new HttpHeaders({
    //  'Accept': 'application/json',
    //  'Authorization': 'my-token'
    //});

    return this.http.get<Book>(`/api/books/${id}`, {
      headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': 'my-token'
        })
     });
  }

  getOldBookById(id: number): Observable<OldBook> {
    console.log(`get old book ${id}`);

    return this.http.get<Book>(`/api/books/${id}`)
      .pipe(
        map(b => <OldBook>{
          bookTitle: b.title,
          year: b.publicationYear
        }),
        tap(classicBook => console.log(classicBook))
      );
  }

  addBook(newBook: Book): Observable<Book> {
    console.log(`add new book`);

    return this.http.post<Book>(`/api/books`, newBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateBook(updatedBook: Book): Observable<void> {
    console.log(`update book ${updatedBook.bookID}`);

    return this.http.put<void>(`/api/books/${updatedBook.bookID}`, updatedBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteBook(bookId: number): Observable<void> {
    console.log(`delete book ${bookId}`);

    return this.http.delete<void>(`/api/books/${bookId}`);
  }
}
