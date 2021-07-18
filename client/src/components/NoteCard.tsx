import { Component } from 'react';
import NotesForm from './NotesForm';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';
import { Draggable } from 'react-beautiful-dnd';

type NoteState = {
    edit: any;
};

type NoteProps = {
    updateNote: any;
    removeNote: any;
    notes: Array<any>;
};

class NoteCard extends Component<NoteProps, NoteState> {
    constructor(props: any) {
        super(props);
        this.state = {
            edit: { id: null, value: '' }
        };
        this.submitUpdate = this.submitUpdate.bind(this);
    }

    submitUpdate(value: any) {
        this.props.updateNote(this.state.edit.id, value);
        this.setState({
            edit: {
                id: null,
                value: ''
            }
        });
    }

    render() {
        if (this.state.edit.id) {
            return <NotesForm edit={this.state.edit} onSubmit={this.submitUpdate} />;
        } else {
            return this.props.notes.map((note, index) => (
                <Draggable key={note.id.toString()} draggableId={note.id.toString()} index={index}>
                    {provided => (
                        <div className="note-row" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                            <div key={note.id}>{note.text}</div>

                            <div className="icons">
                                <RiCloseCircleLine onClick={() => this.props.removeNote(note.id)} className="delete-icon" />
                                <TiEdit onClick={() => this.setState({ edit: { id: note.id, value: note.text } })} className="edit-icon" />
                            </div>
                        </div>
                    )}
                </Draggable>
            ));
        }
    }
}

export default NoteCard;
