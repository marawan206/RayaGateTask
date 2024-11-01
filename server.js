<template>
  <div class="book-app">
    <h1>Books</h1>

    <form @submit.prevent="addBook" class="book-form">
      <label for="title">Title:</label>
      <input v-model="newBook.title" id="title" required />

      <label for="author">Author:</label>
      <input v-model="newBook.author" id="author" required />

      <label for="description">Description:</label>
      <textarea v-model="newBook.description" id="description" required></textarea>

      <button type="submit" class="add-edit-button">{{ editingBook ? 'Edit Book' : 'Add Book' }}</button>
      <button type="button" @click="cancelEdit" v-if="editingBook" class="cancel-button">Cancel</button>
    </form>

    <!-- Loading state -->
    <div v-if="loading" class="loading-message">Loading...</div>

    <!-- Error state -->
    <div v-if="error" class="error-message">{{ error.message }}</div>

    <ul class="book-list">
      <li v-for="book in books" :key="book.id" class="book-item">
        {{ book.title }} - {{ book.author }} - {{ book.description }}
        <button @click="editBook(book)" class="edit-button">Edit</button>
        <button @click="confirmDelete(book.id)" class="delete-button">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const apiUrl = import.meta.env.VITE_API_URL;

const {
  data: books,
  reload: reloadBooks,
  loading,
  error,
} = await useAsyncData("books", () =>
  $fetch(`${apiUrl}/api/books`)
);

const newBook = ref({
  title: '',
  author: '',
  description: '',
});

const editingBook = ref(null);

const addBook = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    if (editingBook.value) {
      const response = await $fetch(`${apiUrl}/api/books/${editingBook.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook.value),
      });

      if (response.ok) {
        const updatedBook = await response.json();
        const index = books.value.findIndex((book) => book.id === editingBook.value.id);
        if (index !== -1) {
          books.value[index] = updatedBook;
        }

        newBook.value = {
          title: '',
          author: '',
          description: '',
        };
        editingBook.value = null;
      } else {
        throw new Error('Failed to update the book');
      }
    } else {
      const response = await $fetch(`${apiUrl}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook.value),
      });

      if (response.ok) {
        books.value.push(await response.json());

        newBook.value = {
          title: '',
          author: '',
          description: '',
        };
      } else {
        throw new Error('Failed to add a new book');
      }
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
  location.reload();
};

const validateForm = () => {
  if (!newBook.value.title || !newBook.value.author || !newBook.value.description) {
    alert('Please fill in all the required fields.');
    return false;
  }
  return true;
};

const editBook = (book) => {
  editingBook.value = book;
  newBook.value = { ...book };
};

const cancelEdit = () => {
  newBook.value = {
    title: '',
    author: '',
    description: '',
  };
  editingBook.value = null;
};

const confirmDelete = (id) => {
  if (window.confirm('Are you sure you want to delete this book?')) {
    deleteBook(id);
  }
};

const deleteBook = async (id) => {
  try {
    const response = await $fetch(`${apiUrl}/api/books/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      books.value = books.value.filter((book) => book.id !== id);

      if (editingBook.value && editingBook.value.id === id) {
        cancelEdit();
      }
    } else {
      throw new Error('Failed to delete the book');
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
  location.reload();
};
</script>

<style scoped>
.book-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.book-form {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

.add-edit-button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.cancel-button {
  padding: 10px;
  background-color: #ff5252;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: 10px;
}

.loading-message,
.error-message {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.book-list {
  list-style: none;
  padding: 0;
}

.book-item {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  position: relative;
}

.edit-button,
.delete-button {
  margin-left: 10px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>