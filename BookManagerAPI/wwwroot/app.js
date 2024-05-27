const apiBaseUrl = 'https://localhost:5001/api/books';

document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    document.getElementById('form').addEventListener('submit', handleFormSubmit);
});

async function loadBooks() {
    try {
        const response = await fetch(apiBaseUrl);
        if (!response.ok) {
            throw new Error('Failed to load books');
        }
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        displayErrorMessage(error.message);
    }
}

function renderBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Year</th>
                    <th>Genre</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${books.map(book => `
                    <tr>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.year}</td>
                        <td>${book.genre}</td>
                        <td>
                            <button onclick="editBook(${book.id})">Edit</button>
                            <button onclick="deleteBook(${book.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const bookId = document.getElementById('bookId').value;
    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        year: document.getElementById('year').value,
        genre: document.getElementById('genre').value
    };

    try {
        if (bookId) {
            await updateBook(bookId, book);
        } else {
            await addBook(book);
        }
        loadBooks();
        resetForm();
    } catch (error) {
        displayErrorMessage(error.message);
    }
}

async function addBook(book) {
    const response = await fetch(apiBaseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    });
    if (!response.ok) {
        throw new Error('Failed to add book');
    }
}

async function updateBook(id, book) {
    const response = await fetch(`${apiBaseUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    });
    if (!response.ok) {
        throw new Error('Failed to update book');
    }
}

async function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        const response = await fetch(`${apiBaseUrl}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete book');
        }
        loadBooks();
    }
}

function editBook(id) {
    // Implement edit book functionality
}

function resetForm() {
    document.getElementById('bookId').value = '';
    document.getElementById('form').reset();
}

function displayErrorMessage(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
    setTimeout(() => {
        errorMessageElement.textContent = '';
    }, 5000);
}

