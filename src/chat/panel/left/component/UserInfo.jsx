import React, { useState, useEffect } from 'react';
import { Avatar, Button, Dropdown, Menu, Modal, Switch ,Form,Input,message} from 'antd';
import { axiosPut } from '../../../util/Request';
import { useDispatch, useSelector } from 'react-redux';
import * as Params from '../../../common/param/Params';
import { axiosGet } from '../../../util/Request';
import { actions } from '../../../redux/module/userInfo';
import { useNavigate } from "react-router-dom";
import UploadAvatar from "../../../common/components/UploadAvatar"
const UserInfo = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.userInfoReducer.user);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [switchStatus,setSwtitchStatus] = useState(false)
    useEffect(() => {
        fetchUserDetails();
    }, []);

    //加载用户信息
    const fetchUserDetails = async () => {
        try {
            const response = await axiosGet(`${Params.USER_URL}`);
            const updatedUser = {
                ...response.data,
                avatar: response.data.avatar ? `${Params.HOST}/file/${response.data.avatar}` : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${response.data.username}`
            };
            dispatch(actions.setUser(updatedUser));
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };



    const loginout = () => {
        localStorage.removeItem('uuid');
        localStorage.removeItem('username');
        localStorage.removeItem('ACCESS_TOKEN');
        navigate("/login");
    };

    //更新用户头像
    const handleImgChange = (imgUrl)=>{
        // console.log(imgUrl)
        const newUser = {
            ...user,
            avatar: `${Params.HOST}/file/${imgUrl}`
        };
        dispatch(actions.setUser(newUser));
    }

    //提交表单
    const submitProfile = (data)=>{
        const avatarUrlArr = user.avatar.split("/");
        data.avatar = avatarUrlArr[avatarUrlArr.length -1 ]

        axiosPut(`${Params.HOST}/user`, data)
        .then(response => {
            console.log(response)
            setIsModalVisible(false);
            message.success("Profile updated!");
        });

    }
    const menu = (
        <Menu>
            <Menu.Item key="1">
                <Button type='link'>{user.username}</Button>
            </Menu.Item>
            <Menu.Item key="2">
                <Button type='link' onClick={()=>setIsModalVisible(true)}>Profile</Button>
            </Menu.Item>
            <Menu.Item key="3">
                <Button type='link' onClick={loginout}>退出</Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Dropdown overlay={menu} placement="bottom" arrow>
                <Avatar src={user.avatar} alt={user.username} />
            </Dropdown>

            <Modal title="Edit Profile" open={isModalVisible} onCancel={()=>setIsModalVisible(false)} footer={null}>
                <Form
                    name="basic"

                        labelCol={{
                        span: 8,
                        }}

                        wrapperCol={{
                        span: 16,
                        }}

                        style={{
                        maxWidth: 600,
                        }}

                        initialValues={{
                        remember: true,
                        }}

                    onFinish={submitProfile}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                    label="头像"
                    name="avatar"
                    >
                        {/* <Input  /> */}
                        <UploadAvatar objectType="user" handleImgChange={handleImgChange} />
                    </Form.Item>

                    <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                    >
                        <div>修改密码</div>
                        <Switch defaultChecked onChange={()=>setSwtitchStatus(!switchStatus)} checked={switchStatus} />
                    </Form.Item>


                    {switchStatus &&(
                        <div>
                            <Form.Item
                                label="当前密码"
                                name="currentPassword"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Password required!',
                                    },
                                ]}
                                >
                                <Input />
                            </Form.Item>


                            <Form.Item
                                label="新密码"
                                name="newPassword"
                                rules={[
                                    {
                                    required: true,
                                    message: 'New Password required!',
                                    },
                                    {
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[@#$+-])[A-Za-z\d@#$+-]{6,}$/,
                                        message: "长度>=6,大小写字母,数字,特殊符号(@,#,$,+,-)",
                                    },
                                ]}
                                >
                                <Input />
                            </Form.Item>
                        </div>
                    )}


                    <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                    >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>

                    </Form.Item>
                </Form>
    {/* <UploadAvatar objectType="user" handleImgChange={handleImgChange} /> */}
            </Modal>
        </>
    );
};

export default UserInfo;