import React, { useState, useEffect } from 'react';
import './App.css';
import { NoteDTO } from './DTOs/note.dto';

function App() {
  const [notes, setNotes] = useState<NoteDTO[]>([
    // {
    //   id: 1,
    //   title: 'Note Title',
    //   content: 'Note to self'
    // },
    // {
    //   id: 2,
    //   title: 'Note Title',
    //   content: 'Note to myself'
    // },
    // {
    //   id: 3,
    //   title: 'Note Title',
    //   content: 'Note to herself'
    // },
  ])
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<NoteDTO | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notes');
        const notes: NoteDTO[] = await response.json();
        setNotes(notes);
      } catch (error) {
        console.log(error);
        
      }
    }

    fetchNotes();
  }, []);

  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault();
    const newNote = {
      id: notes.length + 1,
      title,
      content
    }

    setNotes([...notes, newNote]);
    setTitle('');
    setContent('');
    setSelectedNote(null);
  }

  const handleSelectedNote = (note: NoteDTO) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  const handleUpdateNote = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) return;

    const updatedNote = notes.map(note => selectedNote.id === note.id ? selectedNote : note);
    setNotes(updatedNote);
    setTitle('');
    setContent('');
    setSelectedNote(null);
  }

  const handleCancelUpdate = () => {
    setTitle('');
    setContent('');
    setSelectedNote(null);
  }

  const handleDeleteNote = (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
  }

  return (
    <div className='appContainer'>
      <form className="note-form" onSubmit={handleAddNote}>
        <input type="text" placeholder="Title" required value={title} onChange={(event) => setTitle(event.target.value)} />
        <textarea placeholder="Take a note..." row={10} required value={content} onChange={(event) => setContent(event.target.value)} />

        {
          selectedNote ? (
            <div className="edit-note">
              <button type="submit">Save</button>
              <button onClick={handleCancelUpdate}>Cancel</button>
            </div>
          ) : (
            <button type="submit">Add Note</button>
          )
        }
      </form>
      <div className="notes-grid">
        {
          notes.map(note => (
            <div className="note-item" key={note.id} onClick={() => handleSelectedNote(note)}>
            <div className="note-header">
              <button key={note.id} onClick={(event) => handleDeleteNote(event,note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
