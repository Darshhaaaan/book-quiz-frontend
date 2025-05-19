import React, { useEffect, useState } from "react";
import axios from "axios";

const Result = ({ result }) => {
  const { mainGenre, subGenre } = result;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get("http://localhost:4000/recommend", {
          params: { genre: mainGenre, subgenre: subGenre },
        });

        setBook(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Book fetch error:", err.message);
        setError("No book found or server error.");
        setLoading(false);
      }
    };

    fetchBook();
  }, [mainGenre, subGenre]);

  return (
    <div className="result-box">
      <h1>Your Suggested Book</h1>

      {loading && <p>Finding the best book for you...</p>}
      {error && <p>{error}</p>}

      {book && (
        <div className="book-suggestion">
          <a
            href={`https://www.goodreads.com/search?q=${encodeURIComponent(book.title)} ${encodeURIComponent(book.author)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={book.cover} alt={book.title} />
          </a>
          <p><strong>{book.title}</strong> by {book.author}</p>
        </div>
      )}
    </div>
  );
};

export default Result;
