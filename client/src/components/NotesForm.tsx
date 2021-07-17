import React, { Component } from 'react';

type NotesFormState = {
    input: string;
};

type NotesFormProps = {
    edit?: any;
    onSubmit: any;
};

export class NotesForm extends Component<NotesFormProps, NotesFormState> {
    constructor(props: any) {
        super(props);
        this.state = { input: props.edit ? props.edit.value : '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e: React.ChangeEvent<any>) {
        this.setState({ input: e.target.value });
    }

    handleSubmit(e: React.ChangeEvent<any>) {
        e.preventDefault();

        this.props.onSubmit({
            id: Math.floor(Math.random() * 10000),
            text: this.state.input
        });
        this.setState({ input: '' });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="todo-form">
                {this.props.edit ? (
                    <>
                        <input placeholder="Update your item" value={this.state.input} onChange={this.handleChange} name="text" className="todo-input edit" />
                        <button onClick={this.handleSubmit} className="todo-button edit">
                            Update
                        </button>
                    </>
                ) : (
                    <>
                        <input placeholder="Add a todo" value={this.state.input} onChange={this.handleChange} name="text" className="todo-input" />
                        <button onClick={this.handleSubmit} className="todo-button">
                            Add todo
                        </button>
                    </>
                )}
            </form>
        );
    }
}

export default NotesForm;
