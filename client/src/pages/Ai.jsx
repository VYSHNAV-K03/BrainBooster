import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

const Books = () => {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBooks = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/books?query=${query}`);
            setBooks(response.data.books);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
        setLoading(false);
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">📚 Find Books for Your Course</h2>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter subject (e.g., Computer Science)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={fetchBooks} disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>

                {books.length === 0 && !loading && (
                    <p className="text-center text-muted">No books found.</p>
                )}

                {books.length > 0 && (
                    <div className="row">
                        {books.map((book, index) => (
                            <div key={index} className="col-md-4 col-sm-6 mb-4">
                                <div className="card h-100 shadow-sm">
                                    {book.cover && (
                                        <img src={book.cover} className="card-img-top" alt={book.title} />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{book.title}</h5>
                                        <p className="card-text">
                                            <strong>Author:</strong> {book.author}
                                        </p>
                                        <p className="card-text">
                                            <strong>Year:</strong> {book.year}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Books;
