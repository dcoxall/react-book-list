import React from 'react';

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

const BookList: React.FC = () => {
  return (
    <ul className="book-list">
      <BookItem
        title="My First Book"
        description="Nothing much here yet"
       />
    </ul>
  );
}

export default BookList;
