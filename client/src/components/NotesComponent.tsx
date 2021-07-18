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

        fetch(process.env.REACT_APP_API + 'note/dragAndDrop', {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(items)
        }).then(res => {
            this.setState({ notes: items });
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
                text: note.text
            })
        }).then(res => {
            this.refreshList();
        });
    }

    updateNote(noteId: number, newValue: any) {
        if (!newValue.text || /^\s*$/.test(newValue.text)) {
            return;
        }

        fetch(process.env.REACT_APP_API + 'note', {
            method: 'PUT',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: noteId,
                text: newValue.text
            })
        }).then(res => {
            this.refreshList();
        });
    }

    removeNote(id: number | string) {
        fetch(process.env.REACT_APP_API + 'note/' + id, {
            method: 'DELETE',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
        }).then(res => {
            this.refreshList();
        });
    }

    refreshList() {
        fetch(process.env.REACT_APP_API + 'note')
            .then(response => response.json())
            .then(data => {
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
