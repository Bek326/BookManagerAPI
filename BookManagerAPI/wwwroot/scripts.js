const apiBaseUrl = 'https://localhost:7140/api/books'; 

document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    document.getElementById('form').addEventListener('submit', handleFormSubmit);
    $('#booksModal').on('show.bs.modal', loadBooksIntoModal);
});

async function loadBooks() {
    try {
        const response = await fetch(apiBaseUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const books = await response.json();
        console.log('Books loaded:', books);
        displayBooks(books);
    } catch (error) {
        console.error('Failed to load books:', error);
    }
}

function displayBooks(books) {
    const bookList = document.getElementById('books-table-body');
    bookList.innerHTML = books.map(book => `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.year}</td>
            <td>${book.genre}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editBook(${book.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Delete</button>
            </td>
        </tr>
    `).join('');
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
        let response;
        if (bookId) {
            response = await fetch(`${apiBaseUrl}/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            });
        } else {
            response = await fetch(apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            });
        }

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        console.log('Book saved:', await response.json());
        await loadBooks();

        document.getElementById('form').reset();
    } catch (error) {
        console.error('Failed to save book:', error);
    }
}

async function editBook(id) {
    try {
        const response = await fetch(`${apiBaseUrl}/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const book = await response.json();

        document.getElementById('bookId').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('year').value = book.year;
        document.getElementById('genre').value = book.genre;
    } catch (error) {
        console.error('Failed to edit book:', error);
    }
}

async function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        try {
            const response = await fetch(`${apiBaseUrl}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            console.log('Book deleted:', await response.json());
            await loadBooks();
        } catch (error) {
            console.error('Failed to delete book:', error);
        }
    }
}

function sortBooks(field) {
    const tbody = document.getElementById('books-table-body');
    const rows = Array.from(tbody.getElementsByTagName('tr'));

    const sortedRows = rows.sort((a, b) => {
        const aField = a.querySelector(`td:nth-child(${getFieldIndex(field)})`).innerText;
        const bField = b.querySelector(`td:nth-child(${getFieldIndex(field)})`).innerText;

        return aField.localeCompare(bField);
    });

    tbody.innerHTML = '';
    sortedRows.forEach(row => tbody.appendChild(row));
}

function getFieldIndex(field) {
    switch (field) {
        case 'title':
            return 1;
        case 'author':
            return 2;
        case 'year':
            return 3;
        default:
            return 1;
    }
}

async function loadBooksIntoModal() {
    try {
        const response = await fetch(apiBaseUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const books = await response.json();

        const modalBody = document.getElementById('books-modal-body');
        modalBody.innerHTML = books.map(book => `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.genre}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load books into modal:', error);
    }
}