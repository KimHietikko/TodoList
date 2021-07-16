import React, { useState } from 'react';
import TodoForm from './TodoForm';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';
import { Draggable } from 'react-beautiful-dnd';

const Todo = ({ todos, removeTodo, updateTodo }) => {
    const [edit, setEdit] = useState({
        id: null,
        value: ''
    });

    const submitUpdate = value => {
        updateTodo(edit.id, value);
        setEdit({
            id: null,
            value: ''
        });
    };

    if (edit.id) {
        return <TodoForm edit={edit} onSubmit={submitUpdate} />;
    }

    return todos.map((todo, index) => (
        <Draggable key={todo.id.toString()} draggableId={todo.id.toString()} index={index}>
            {provided => (
                <div className="todo-row" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <div key={todo.id}>{todo.text}</div>

                    <div className="icons">
                        <RiCloseCircleLine onClick={() => removeTodo(todo.id)} className="delete-icon" />
                        <TiEdit onClick={() => setEdit({ id: todo.id, value: todo.text })} className="edit-icon" />
                    </div>
                </div>
            )}
        </Draggable>
    ));
};

export default Todo;
