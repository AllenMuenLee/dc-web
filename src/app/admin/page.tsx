'use client';

import React, { useState, useEffect } from 'react';

interface Card {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: 'Home' | 'Software' | 'Games';
  imagePath?: string;
  productLink?: string;
  videoLink?: string;
  createdAt: number;
}

export default function AdminDashboard() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [newCard, setNewCard] = useState<Omit<Card, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Software',
    imagePath: '',
    productLink: '',
    videoLink: '',
  });
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [numberOfHighlights, setNumberOfHighlights] = useState(1);

  useEffect(() => {
    if (loggedIn) {
      fetchCards();
      fetchSettings();
    }
  }, [loggedIn]);

  const fetchCards = async () => {
    const res = await fetch('/api/cards');
    if (res.ok) {
      const data = await res.json();
      setCards(data);
    }
  };

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      setNumberOfHighlights(data.numberOfHighlights);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ numberOfHighlights }),
    });

    if (res.ok) {
      setMessage('Settings updated successfully!');
    } else {
      setMessage('Failed to update settings.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setLoggedIn(true);
      setMessage(data.message);
    } else {
      setMessage(data.message);
    }
  };

  const handleFileUpload = async (): Promise<string | undefined> => {
    if (!selectedFile) {
      console.log('No file selected for upload.');
      return undefined;
    }
    console.log('Attempting to upload file:', selectedFile.name);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      console.log('File upload successful:', data.imagePath);
      setSelectedFile(null);
      return data.imagePath;
    } else {
      const errorText = await res.text();
      console.error('Image upload failed with status', res.status, ':', errorText);
      setMessage(`Image upload failed: ${errorText}`);
      return undefined;
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedImagePath = await handleFileUpload();

    const res = await fetch('/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newCard, imagePath: uploadedImagePath }),
    });

    if (res.ok) {
      setNewCard({ title: '', description: '', shortDescription: '', category: 'Home', imagePath: '', productLink: '', videoLink: '' });
      fetchCards();
    }
  };

  const handleEditCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    let updatedImagePath = editingCard.imagePath;
    if (selectedFile) {
      updatedImagePath = await handleFileUpload();
    }

    const res = await fetch('/api/cards', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...editingCard, imagePath: updatedImagePath }),
    });

    if (res.ok) {
      setEditingCard(null);
      setSelectedFile(null);
      fetchCards();
    }
  };

  const handleDeleteCard = async (id: string) => {
    const res = await fetch('/api/cards', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchCards();
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
            </div>
            {message && <p className="text-center mt-4 text-red-500">{message}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      {message && <p className="text-center mt-4 text-green-500">{message}</p>}

      {/* Add New Card */}
      <div className="bg-white p-6 rounded shadow-md mb-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Add New Card</h2>
        <form onSubmit={handleAddCard} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="newTitle" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
            <input
              type="text"
              id="newTitle"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newCard.title}
              onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="newDescription" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
            <textarea
              id="newDescription"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newCard.description}
              onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="newShortDescription" className="block text-gray-700 text-sm font-bold mb-2">Short Description (optional):</label>
            <input
              type="text"
              id="newShortDescription"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newCard.shortDescription}
              onChange={(e) => setNewCard({ ...newCard, shortDescription: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="newCategory" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
            <select
              id="newCategory"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newCard.category}
              onChange={(e) => setNewCard({ ...newCard, category: e.target.value as 'Home' | 'Software' | 'Games' })}
            >
              <option value="Software">Software</option>
              <option value="Games">Games</option>
            </select>
          </div>
          <div>
            <label htmlFor="newImageFile" className="block text-gray-700 text-sm font-bold mb-2">Image File:</label>
            <input
              type="file"
              id="newImageFile"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>
          <div>
            <label htmlFor="newProductLink" className="block text-gray-700 text-sm font-bold mb-2">Product Link (optional):</label>
            <input
              type="text"
              id="newProductLink"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newCard.productLink}
              onChange={(e) => setNewCard({ ...newCard, productLink: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="newVideoLink" className="block text-gray-700 text-sm font-bold mb-2">Video Link (optional):</label>
            <input
              type="text"
              id="newVideoLink"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newCard.videoLink}
              onChange={(e) => setNewCard({ ...newCard, videoLink: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Card
            </button>
          </div>
        </form>
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded shadow-md mb-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="numberOfHighlights" className="block text-gray-700 text-sm font-bold mb-2">Number of Highlights:</label>
            <input
              type="number"
              id="numberOfHighlights"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={numberOfHighlights}
              onChange={(e) => setNumberOfHighlights(parseInt(e.target.value))}
              min="0"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Settings
            </button>
          </div>
        </form>
      </div>

      {/* Card List */}
      <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Existing Cards</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Short Description</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Image Path</th>
                <th className="py-2 px-4 border-b">Product Link</th>
                <th className="py-2 px-4 border-b">Video Link</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr key={card.id}>
                  <td className="py-2 px-4 border-b">{card.title}</td>
                  <td className="py-2 px-4 border-b">{card.shortDescription || (card.description.split(' ').slice(0, 10).join(' ') + '...')}</td>
                  <td className="py-2 px-4 border-b">{card.shortDescription}</td>
                  <td className="py-2 px-4 border-b">{card.category}</td>
                  <td className="py-2 px-4 border-b">{card.imagePath}</td>
                  <td className="py-2 px-4 border-b">{card.productLink}</td>
                  <td className="py-2 px-4 border-b">{card.videoLink}</td>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button
                      onClick={() => setEditingCard(card)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Card Panel */}
      {editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full mx-4 relative">
            <h2 className="text-2xl font-bold mb-4">Edit Card</h2>
            <form onSubmit={handleEditCard} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="editTitle" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                <input
                  type="text"
                  id="editTitle"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="editDescription" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                <textarea
                  id="editDescription"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCard.description}
                  onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="editShortDescription" className="block text-gray-700 text-sm font-bold mb-2">Short Description (optional):</label>
                <input
                  type="text"
                  id="editShortDescription"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCard.shortDescription || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, shortDescription: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="editCategory" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                <select
                  id="editCategory"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCard.category}
                  onChange={(e) => setEditingCard({ ...editingCard, category: e.target.value as 'Home' | 'Software' | 'Games' })}
                >
                  <option value="Software">Software</option>
                  <option value="Games">Games</option>
                </select>
              </div>
              <div>
                <label htmlFor="editImageFile" className="block text-gray-700 text-sm font-bold mb-2">Image File (leave blank to keep current):</label>
                <input
                  type="file"
                  id="editImageFile"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                />
                {editingCard.imagePath && <p className="text-sm text-gray-500 mt-1">Current: {editingCard.imagePath}</p>}
              </div>
              <div>
                <label htmlFor="editProductLink" className="block text-gray-700 text-sm font-bold mb-2">Product Link (optional):</label>
                <input
                  type="text"
                  id="editProductLink"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCard.productLink || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, productLink: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="editVideoLink" className="block text-gray-700 text-sm font-bold mb-2">Video Link (optional):</label>
                <input
                  type="text"
                  id="editVideoLink"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingCard.videoLink || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, videoLink: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
