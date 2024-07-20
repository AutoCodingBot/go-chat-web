import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Comment } from 'antd';

import { actions } from '../../../redux/module/panel';

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value, toUser }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} id="messageArea" />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary" disabled={toUser === ''}>
                Send
            </Button>
        </Form.Item>
    </>
);

const ChatEdit = (props) => {
    const dispatch = useDispatch();
    const { chooseUser } = useSelector(state => state.panelReducer);
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');
    useEffect(() => {
        const bindParse = () => {
            const messageArea = document.getElementById("messageArea");
            if (messageArea) {
                messageArea.addEventListener("paste", handlePaste, false);
            }
            return () => {
                if (messageArea) {
                    messageArea.removeEventListener("paste", handlePaste, false);
                }
            };
        };

        bindParse();
    }, []);

    const handlePaste = (e) => {
        const data = e.clipboardData;
        if (!data.items) return;
        const items = data.items;

        if (items.length <= 0) return;

        const item = items[0];
        if (item.kind !== 'file') return;
        const blob = item.getAsFile();

        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);

        reader.onload = (e) => {
            const imgData = e.target.result;
            const fileData = {
                content: value,
                contentType: 3,
                file: new Uint8Array(imgData),
            };
            dispatch(actions.sendMessage(fileData));
            dispatch(actions.appendImgToPanel(imgData));
        };
    };


    const handleSubmit = () => {
        if (!value || submitting) return;
        const message = {
            content: value,
            contentType: 1,
        };

        props.sendMessage(message)

        props.appendMessage(value);

        setSubmitting(false);
        setValue('');
    };

    return (
        <>
            <Comment
                content={
                    <Editor
                        onChange={(e)=>setValue(e.target.value)}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        value={value}
                        toUser={chooseUser.toUser}
                    />
                }
            />
        </>
    );
};

export default connect(state => ({
    chooseUser: state.panelReducer.chooseUser,
    messageList: state.panelReducer.messageList,
}))(ChatEdit);