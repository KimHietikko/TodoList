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
            text: this.state.input
        });
        this.setState({ input: '' });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="note-form">
                {this.props.edit ? (
                    <>
                        <input placeholder="Update your note" maxLength={2000} value={this.state.input} onChange={this.handleChange} name="text" className="note-input edit" />
                        <button onClick={this.handleSubmit} className="note-button edit">
                            Update
                        </button>
                    </>
                ) : (
                    <>
                        <input placeholder="Add a note" maxLength={2000} value={this.state.input} onChange={this.handleChange} name="text" className="note-input" />
                        <button onClick={this.handleSubmit} className="note-button">
                            Add note
                        </button>
                    </>
                )}
            </form>
        );
    }
}

export default NotesForm;
