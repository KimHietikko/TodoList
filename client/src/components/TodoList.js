import React, { useState } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

function TodoList() {
    const [todos, setTodos] = useState([
        { id: 1, text: 'Moro' },
        { id: 2, text: 'Testi' }
    ]);

    const addTodo = todo => {
        if (!todo.text || /^\s*$/.test(todo.text)) {
            return;
        }

        const newTodos = [todo, ...todos];

        setTodos(newTodos);
        console.log(...todos);
    };

    const updateTodo = (todoId, newValue) => {
        if (!newValue.text || /^\s*$/.test(newValue.text)) {
            return;
        }

        setTodos(prev => prev.map(item => (item.id === todoId ? newValue : item)));
    };

    const removeTodo = id => {
        const removedArr = [...todos].filter(todo => todo.id !== id);

        setTodos(removedArr);
    };

    function handleOnDragEnd(result) {
        if (!result.destination) return;

        const items = Array.from(todos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setTodos(items);
    }

    return (
        <>
            <h1>What's the Plan for Today?</h1>
            <TodoForm onSubmit={addTodo} />
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="todo-row">
                    {provided => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            <Todo todos={todos} removeTodo={removeTodo} updateTodo={updateTodo} />

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
}

export default TodoList;
