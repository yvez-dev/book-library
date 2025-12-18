const bookmarkList = [];
const addBookForm = document.getElementById("addBookForm");
const { bookName, bookAuthor, bookPages, bookYear, haveReadToggle } =
	addBookForm.elements;

/* OLD CLASS
function Book(bookID, title, author, pages, year, haveRead) {
	this.bookID = bookID;
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.year = year;
	this.haveRead = haveRead;

	// Delete bookmark functionality for each bookmark
	this.deleteBookmark = function (bookIndexToDelete) {
		if (bookIndexToDelete !== -1) {
			bookmarkList.splice(bookIndexToDelete, 1);
			populateBookmarkList(bookmarkList);
		}
	};

	// Functionality for haveRead toggle to reflect value change in the bookmarkList
	this.updateHaveReadValue = function (toggleValue) {
		this.haveRead = toggleValue;
		populateBookmarkList(bookmarkList);
	};
} 
*/

// New Class
class Book {
	#bookID;

	constructor(bookID, title, author, pages, year, haveRead) {
		this.#bookID = bookID;
		this.title = title;
		this.author = author;
		this.pages = pages;
		this.year = year;
		this.haveRead = haveRead;
	}

	get bookID() {
		return this.#bookID;
	}

	deleteBookmark(bookIndexToDelete) {
		if (bookIndexToDelete !== -1) {
			bookmarkList.splice(bookIndexToDelete, 1);
			populateBookmarkList(bookmarkList);
		}
	}

	updateHaveReadValue(toggleValue) {
		this.haveRead = toggleValue;
		populateBookmarkList(bookmarkList);
	}
}

addBookForm.addEventListener("submit", (e) => addBooktoLibrary(e));

bookName.addEventListener("input", () => {
	if (bookName.validity.valueMissing) {
		bookName.setCustomValidity("Book title cannot be empty");
	} else {
		bookName.setCustomValidity("");
	}
});

bookPages.addEventListener("input", () => {
	if (bookPages.validity.rangeOverflow) {
		bookPages.setCustomValidity("Book page is too long");
	} else {
		bookPages.setCustomValidity("");
	}
});

bookYear.addEventListener("input", () => {
	if (bookYear.validity.rangeUnderflow) {
		bookYear.setCustomValidity("Book year cannot be negative");
	} else {
		bookYear.setCustomValidity("");
	}
});

function populateBookmarkList(bookmarkList) {
	// select the bookmark container and clear its contents
	const bookmarkListContainer = document.querySelector(".bookmark-list");
	bookmarkListContainer.innerHTML = "";

	// Add each bookmark object inside the bookmarkListContainer
	for (let i = 0; i <= bookmarkList.length - 1; i++) {
		bookmarkListContainer.innerHTML += `
		<div class="bookmark" data-bookid="${bookmarkList[i].bookID}">
			<h3 class="book-title">${sanitizeFormInputs(bookmarkList[i].title)}</h3>
			<p class="book-data">
				<b>Author:</b> ${sanitizeFormInputs(bookmarkList[i].author)} <br />
				<b>Pages:</b> ${sanitizeFormInputs(bookmarkList[i].pages)} <br />
				<b>Year:</b> ${sanitizeFormInputs(bookmarkList[i].year)} <br />
			</p>
			<div class="book-status">
				<p>Read:</p>
				<label
					class="toggle"
					for="toggle-${bookmarkList[i].bookID}}">
					<input
						class="toggle__input"
						type="checkbox"
						id="toggle-${bookmarkList[i].bookID}}" 
						${bookmarkList[i].haveRead && "checked"}
						/>
					<div class="toggle__fill"></div>
				</label>
				<button class="delete-bookmark">
					<img
						src="./assets/img/delete.svg"
						alt="Delete icon" />
				</button>
			</div>
		</div>
		`;
	}

	// Restore the add bookmark button at the end
	bookmarkListContainer.innerHTML += `
		<button
			onclick="addBtn.showModal()"
			class="add-bookmark"
			type="submit">
				<img
					style="height: 3rem"
					src="./assets/img/plus.svg"
					alt="add bookmark icon" />
		</button>
	`;

	// Event listeners for haveRead toggle and delete bookmark button for each bookmark
	Array.from(bookmarkListContainer.children).forEach((bookmark) => {
		const deleteButton = bookmark.querySelector(".delete-bookmark");
		const haveReadToggle = bookmark.querySelector(".toggle__input");

		// Find the index location of the bookmark in the bookmark Array via the bookID data-attribute
		const bookIndex = bookmarkList.findIndex(
			(obj) => obj.bookID === bookmark.dataset.bookid
		);

		if (deleteButton) {
			deleteButton.addEventListener("click", () => {
				bookmarkList[bookIndex].deleteBookmark(bookIndex);
			});
		}

		if (haveReadToggle) {
			haveReadToggle.addEventListener("change", (e) => {
				bookmarkList[bookIndex].updateHaveReadValue(e.target.checked);
			});
		}
	});
}

// Sanitize the string inputs to avoid XSS vulnerabilities
function sanitizeFormInputs(str) {
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function addBooktoLibrary(e) {
	e.preventDefault();
	// Generate random unique ID and get the input values on the dialog form
	const bookID = crypto.randomUUID();

	// Update bookmarkList
	bookmarkList.push(
		new Book(
			bookID,
			bookName.value,
			bookAuthor.value,
			bookPages.value,
			bookYear.value,
			haveReadToggle.checked
		)
	);

	// Populate the bookmarkListContainer and reset the form input values
	populateBookmarkList(bookmarkList);
	addBookForm.reset();
}
