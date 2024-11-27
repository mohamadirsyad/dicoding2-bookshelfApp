document.addEventListener("DOMContentLoaded", function() {
  const inputBookForm = document.getElementById("inputBook");
  const inputBookTitle = document.getElementById("inputBookTitle");
  const inputBookAuthor = document.getElementById("inputBookAuthor");
  const inputBookYear = document.getElementById("inputBookYear");
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");
  const searchBookForm = document.getElementById("searchBook");

  let books = [];

  inputBookForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addBook();
  });

  searchBookForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const searchKeyword = document.getElementById("searchBookTitle").value;
    searchBook(searchKeyword);
  });

  function addBook() {
    const bookTitle = inputBookTitle.value;
    const bookAuthor = inputBookAuthor.value;
    const bookYear = parseInt(inputBookYear.value); 
    const isComplete = inputBookIsComplete.checked;

    const newBook = {
      title: bookTitle,
      author: bookAuthor,
      year: bookYear,
      isComplete: isComplete
    };

    books.push(newBook);
    renderBooks();
    updateDataToStorage();
  }

  function searchBook(keyword) {
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(keyword.toLowerCase()));
    renderBooks(filteredBooks);
  }

  function makeBook(book) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis: " + book.author;

    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun: " + book.year;

    const bookAction = document.createElement("div");
    bookAction.classList.add("action");

    const buttonGreen = document.createElement("button");
    buttonGreen.classList.add("green");
    buttonGreen.innerText = book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
    buttonGreen.addEventListener("click", function() {
      toggleBookStatus(book);
    });

    const buttonRed = document.createElement("button");
    buttonRed.classList.add("red");
    buttonRed.innerText = "Hapus buku";
    buttonRed.addEventListener("click", function() {
      removeBook(book);
    });

    bookAction.appendChild(buttonGreen);
    bookAction.appendChild(buttonRed);

    const newBook = document.createElement("article");
    newBook.classList.add("book_item");
    newBook.appendChild(bookTitle);
    newBook.appendChild(bookAuthor);
    newBook.appendChild(bookYear);
    newBook.appendChild(bookAction);

    return newBook;
  }

  function toggleBookStatus(book) {
    book.isComplete = !book.isComplete;
    renderBooks();
    updateDataToStorage();
  }

  function removeBook(book) {
    const bookshelfList = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
    const confirmationDialog = document.getElementById("deleteBookConfirmation");

    confirmationDialog.style.display = "block";

    const confirmButton = document.getElementById("confirmDeleteBook");
    confirmButton.addEventListener("click", function() {
      books = books.filter(b => b !== book);
      renderBooks();
      confirmationDialog.style.display = "none";
      updateDataToStorage();
    });

    const cancelButton = document.getElementById("cancelDeleteBook");
    cancelButton.addEventListener("click", function() {
      confirmationDialog.style.display = "none";
    });
  }

  function renderBooks(filteredBooks = books) {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    filteredBooks.forEach(book => {
      const newBook = makeBook(book);
      if (book.isComplete) {
        completeBookshelfList.appendChild(newBook);
      } else {
        incompleteBookshelfList.appendChild(newBook);
      }
    });
  }

  function updateDataToStorage() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  function loadBookshelfFromStorage() {
    const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
    books = storedBooks;
    renderBooks();
  }

  loadBookshelfFromStorage();
}); 