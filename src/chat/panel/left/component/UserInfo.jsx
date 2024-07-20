import React, { useState, useEffect } from 'react';
import { Avatar, Button, Dropdown, Menu, Modal, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as Params from '../../../common/param/Params';
import { axiosGet } from '../../../util/Request';
import { actions } from '../../../redux/module/userInfo';
import { useNavigate } from "react-router-dom";


const UserInfo = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.userInfoReducer.user);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    useEffect(() => {
        fetchUserDetails();
    }, []);

    const getBase64=(img, callback) =>{
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    
    const beforeUpload = (file) =>{
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('JPG/PNG only!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    const fetchUserDetails = async () => {
        try {
            const response = await axiosGet(`${Params.USER_URL}${localStorage.uuid}`);
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

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            const response = info.file.response;
            if (response.code !== 0) {
                message.error(response.msg);
            } else {
                const newUser = {
                    ...user,
                    avatar: `${Params.HOST}/file/${response.data}`
                };
                dispatch(actions.setUser(newUser));
                getBase64(info.file.originFileObj, (imageUrl) => {
                    setImageUrl(imageUrl);
                    setLoading(false);
                });
            }
        }
    };

    const menu = (
        <Menu>
            <Menu.Item key="1">
                <Button type='link'>{user.username}</Button>
            </Menu.Item>
            <Menu.Item key="2">
                <Button type='link' onClick={()=>setIsModalVisible(true)}>更新头像</Button>
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

            <Modal title="更新头像" open={isModalVisible} onCancel={()=>setIsModalVisible(false)} footer={null}>
                <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={Params.FILE_URL}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    data={{ uuid: user.uuid }}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                </Upload>
            </Modal>
        </>
    );
};

export default UserInfo;