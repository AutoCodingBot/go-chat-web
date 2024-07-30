import React, { useEffect, useState } from 'react';
import {
    Button,
    Form,
    Input,
    Drawer,
    message
} from 'antd';
import { axiosPostBody } from './util/Request';
import * as Params from './common/param/Params';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [registerDrawerVisible, setRegisterDrawerVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const _uuid = localStorage.getItem('uuid');
        const _accessToken= localStorage.getItem('ACCESS_TOKEN');
        if(_uuid && _accessToken){
            navigate(`/panel/${_uuid}`);
        }
    },[navigate])

    const onFinish = (values) => {
        const data = {
            username: values.username,
            password: values.password
        };
        axiosPostBody(Params.LOGIN_URL, data)
            .then(response => {
                message.success("登录成功!");
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('uuid', response.data.uuid);
                //jwt
                localStorage.setItem("ACCESS_TOKEN",response.data.jwt)
                navigate(`/panel/${response.data.uuid}`);
                //原先的:
                // this.props.history.push("panel/" + response.data.uuid)
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const showRegister = () => {
        setRegisterDrawerVisible(true);
    };

    const registerDrawerOnClose = () => {
        setRegisterDrawerVisible(false);
    };

    const onRegister = (values) => {
        const data = {
            ...values
        };

        axiosPostBody(Params.REGISTER_URL, data)
            .then(_response => {
                message.success("注册成功！");
                setRegisterDrawerVisible(false);
            });
    };


    return (
        <div>
            <Form
                name="basic"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 6 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                style={{ marginTop: 150 }}
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 9, span: 6 }}>
                    <Button type="primary" htmlType="submit">
                        登录
                    </Button>

                    <Button onClick={showRegister} style={{ marginLeft: 40 }}>
                        注册
                    </Button>
                </Form.Item>

            </Form>

            <Drawer
                width='500px'
                forceRender={true}
                title="注册"
                placement="right"
                onClose={registerDrawerOnClose}
                open={registerDrawerVisible}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onRegister}
                    autoComplete="off"
                    style={{ marginTop: 150 }}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '用户名!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '密码!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[{ required: true, message: '邮箱!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="昵称"
                        name="nickname"
                        rules={[{ required: true, message: '昵称!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 2, span: 6 }}>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
                            注册
                        </Button>
                    </Form.Item>

                </Form>
            </Drawer>
        </div>
    );
};

export default Login;