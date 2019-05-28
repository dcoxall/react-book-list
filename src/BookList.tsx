import React, { useState, useEffect, useCallback, useRef } from 'react';

// Open Library Book
interface OLBook {
  key: string;
  title: string;
  description: { value: string } | null;
  subtitle: string | null;
}

// A simpler interface for the front end to use
interface BasicBook {
  key: string;
  title: string;
  description: string | void;
}

// Fetch the books and return an array of books
function fetchBooks(subject: string, offset: number = 0): Promise<BasicBook[]> {
  return fetch(
    `https://openlibrary.org/query.json?type=/type/work&subjects=${subject}&offset=${offset}&title=&description=&subtitle=`
  )
    .then<OLBook[]>(res => res.json())
    .then<BasicBook[]>(res => {
      return res.reduce((acc, book) => {
        return [
          ...acc,
          {
            key: book.key,
            title: book.subtitle ? `${book.title} ${book.subtitle}` : book.title,
            description: book.description ? book.description.value : undefined,
          },
        ];
      }, [] as BasicBook[]);
    });
}

function useVisibility(cb: (isVisible: boolean) => void, deps: React.DependencyList): (node: any) => void {
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  return useCallback(node => {
    if (intersectionObserver.current) {
      intersectionObserver.current.disconnect();
    }

    intersectionObserver.current = new IntersectionObserver(([entry]) => {
      cb(entry.isIntersecting);
    });

    if (node) intersectionObserver.current.observe(node);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

interface BookItemProps {
  title: string;
  description?: string | void;
  ref?: React.Ref<HTMLLIElement>;
}

const BookItem: React.ForwardRefExoticComponent<BookItemProps> =
  React.forwardRef(({ title, description }, ref: React.Ref<HTMLLIElement>) => {
    return (
      <li className="book" ref={ ref }>
        <h4>{ title }</h4>
        { description && <p>{ description }</p> }
      </li>
    );
  });

interface BookListProps {
  subject: string;
}

const BookList: React.FC<BookListProps> = ({ subject }) => {
  const [books, setBooks] = useState<BasicBook[]>([]);
  const [offset, setOffset] = useState(0);

  const lastBook = useVisibility(visible => {
    if (visible) {
      fetchBooks(subject, offset)
        .then(newBooks => {
          setOffset(offset + newBooks.length);
          setBooks([...books, ...newBooks]);
        });
    }
  }, [subject, offset, books]);

  useEffect(() => {
    fetchBooks(subject).then(newBooks => {
      setBooks(newBooks);
      setOffset(newBooks.length);
    });
  }, [subject]);

  return (
    <ul className="book-list">
      { books.map(book => (
        <BookItem
          key={ book.key }
          title={ book.title }
          description={ book.description }
          ref={ books[books.length - 1].key === book.key ? lastBook : null }
        />
      )) }
    </ul>
  );
}

export default BookList;
