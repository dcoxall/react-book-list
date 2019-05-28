import React, { useState, useEffect } from 'react';

// Open Library Book
interface OLBook {
  title: string;
  description: { value: string } | null;
  subtitle: string | null;
}

// A simpler interface for the front end to use
interface BasicBook {
  title: string;
  description: string | void;
}

// Fetch the books and return an array of books
function fetchBooks(subject: string): Promise<BasicBook[]> {
  return fetch(
    `https://openlibrary.org/query.json?type=/type/work&subjects=${subject}&title=&description=&subtitle=`
  )
    .then<OLBook[]>(res => res.json())
    .then<BasicBook[]>(res => {
      return res.reduce((acc, book) => {
        return [
          ...acc,
          {
            title: book.subtitle ? `${book.title} ${book.subtitle}` : book.title,
            description: book.description ? book.description.value : undefined,
          },
        ];
      }, [] as BasicBook[]);
    });
}

interface BookItemProps {
  title: string;
  description?: string | void;
}

const BookItem: React.FC<BookItemProps> = ({ title, description }) => {
  return (
    <li className="book">
      <h4>{ title }</h4>
      { description && <p>{ description }</p> }
    </li>
  );
}

interface BookListProps {
  subject: string;
}

const BookList: React.FC<BookListProps> = ({ subject }) => {
  const [books, setBooks] = useState<BasicBook[]>([]);

  useEffect(() => {
    fetchBooks(subject).then(setBooks);
  }, [subject]);

  return (
    <ul className="book-list">
      { books.map(book => (
        <BookItem
          title={ book.title }
          description={ book.description }
        />
      )) }
    </ul>
  );
}

export default BookList;
