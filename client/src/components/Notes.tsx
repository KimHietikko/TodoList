import { Component } from 'react';
import NotesForm from './NotesForm';
import Note from './Note';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

type NotesState = {
    todos: Array<any>;
};

type NotesProps = {
    edit?: string;
    onSubmit?: any;
};

class Notes extends Component<NotesProps, NotesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            todos: []
        };
        this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
        this.addTodo = this.addTodo.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
        this.removeTodo = this.removeTodo.bind(this);
    }

    handleOnDragEnd(result: any) {
        if (!result.destination) return;

        const items = Array.from(this.state.todos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        fetch(process.env.REACT_APP_API + 'note', {
            method: 'PUT',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: reorderedItem.id,
                text: reorderedItem.text,
                index: result.destination.index
            })
        }).then(res => {
            this.setState({ todos: items });
            this.refreshList();
        });
    }

    addTodo(todo: any) {
        if (!todo.text || /^\s*$/.test(todo.text)) {
            return;
        }

        fetch(process.env.REACT_APP_API + 'note', {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: null,
                text: todo.text,
                index: this.state.todos.length
            })
        }).then(res => {
            this.refreshList();
        });
    }

    updateTodo(todoId: number, newValue: any, index: number) {
        if (!newValue.text || /^\s*$/.test(newValue.text)) {
            return;
        }

        fetch(process.env.REACT_APP_API + 'note', {
            method: 'PUT',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: todoId,
                text: newValue.text,
                index: index
            })
        }).then(res => {
            this.refreshList();
        });
    }

    removeTodo(id: number | string) {
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
                data = data.sort(function (a: any, b: any) {
                    return a.index - b.index;
                });
                this.setState({ todos: data });
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    render() {
        return (
            <>
                <h1>What's the Plan for Today?</h1>
                <NotesForm onSubmit={this.addTodo} />
                <DragDropContext onDragEnd={this.handleOnDragEnd}>
                    <Droppable droppableId="todo-row">
                        {provided => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <Note todos={this.state.todos} removeTodo={this.removeTodo} updateTodo={this.updateTodo} />

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </>
        );
    }
}

export default Notes;
