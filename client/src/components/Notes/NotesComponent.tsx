import { Component } from 'react';
import NotesForm from './NotesForm';
import NoteCard from './NoteCard';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

type NotesState = {
    notes: Array<any>;
};

type NotesProps = {
    edit?: string;
    onSubmit?: any;
};

class NotesComponent extends Component<NotesProps, NotesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            notes: []
        };
        this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
        this.addNote = this.addNote.bind(this);
        this.updateNote = this.updateNote.bind(this);
        this.removeNote = this.removeNote.bind(this);
    }

    handleOnDragEnd(result: any) {
        if (!result.destination) return;

        const items = Array.from(this.state.notes);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const previousItem = items[result.destination.index - 1];
        const nextItem = items[result.destination.index + 1];

        if (!nextItem?.index && previousItem?.index) {
            reorderedItem.index = Math.round(previousItem?.index + 10000);
        } else if (!previousItem?.index && nextItem?.index) {
            reorderedItem.index = Math.round((0 + nextItem?.index) / 2);
        } else {
            reorderedItem.index = Math.round((previousItem?.index + nextItem?.index) / 2);
        }

        fetch(process.env.REACT_APP_API + 'note', {
            method: 'PUT',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(reorderedItem)
        })
            .then(res => {
                this.refreshList();
            })
            .catch(error => {
                console.error('Error:', error);
                this.refreshList();
            });
    }

    addNote(note: any) {
        if (!note.text || /^\s*$/.test(note.text)) {
            return;
        }

        fetch(process.env.REACT_APP_API + 'note', {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: null,
                text: note.text,
                index: (this.state.notes[this.state.notes.length - 1]?.index || 0) + 10000
            })
        })
            .then(res => {
                this.refreshList();
            })
            .catch(error => {
                console.error('Error:', error);
                this.refreshList();
            });
    }

    updateNote(noteId: number, newValue: any, noteIndex: number) {
        if (!newValue.text || /^\s*$/.test(newValue.text)) {
            return;
        }

        fetch(process.env.REACT_APP_API + 'note', {
            method: 'PUT',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: noteId,
                text: newValue.text,
                index: noteIndex
            })
        })
            .then(res => {
                this.refreshList();
            })
            .catch(error => {
                console.error('Error:', error);
                this.refreshList();
            });
    }

    removeNote(id: number | string) {
        fetch(process.env.REACT_APP_API + 'note/' + id, {
            method: 'DELETE',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.refreshList();
            })
            .catch(error => {
                console.error('Error:', error);
                this.refreshList();
            });
    }

    refreshList() {
        fetch(process.env.REACT_APP_API + 'note')
            .then(response => response.json())
            .then(data => {
                data.sort(function (a: any, b: any) {
                    return a.index - b.index;
                });
                this.setState({ notes: data });
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    render() {
        return (
            <>
                <h1>What's on your mind?</h1>
                <NotesForm onSubmit={this.addNote} />
                <DragDropContext onDragEnd={this.handleOnDragEnd}>
                    <Droppable droppableId="note-row">
                        {provided => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <NoteCard notes={this.state.notes} removeNote={this.removeNote} updateNote={this.updateNote} />

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </>
        );
    }
}

export default NotesComponent;
