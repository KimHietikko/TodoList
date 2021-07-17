import { Component } from 'react';
import NotesForm from './NotesForm';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';
import { Draggable } from 'react-beautiful-dnd';

type NoteState = {
    edit: any;
};

type NoteProps = {
    updateTodo: any;
    removeTodo: any;
    todos: Array<any>;
};

class Note extends Component<NoteProps, NoteState> {
    constructor(props: any) {
        super(props);
        this.state = {
            edit: { id: null, value: '' }
        };
        this.submitUpdate = this.submitUpdate.bind(this);
    }

    submitUpdate(value: any) {
        this.props.updateTodo(this.state.edit.id, value);
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
            return this.props.todos.map((todo, index) => (
                <Draggable key={todo.id.toString()} draggableId={todo.id.toString()} index={index}>
                    {provided => (
                        <div className="todo-row" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                            <div key={todo.id}>{todo.text}</div>

                            <div className="icons">
                                <RiCloseCircleLine onClick={() => this.props.removeTodo(todo.id)} className="delete-icon" />
                                <TiEdit onClick={() => this.setState({ edit: { id: todo.id, value: todo.text } })} className="edit-icon" />
                            </div>
                        </div>
                    )}
                </Draggable>
            ));
        }
    }
}

export default Note;
