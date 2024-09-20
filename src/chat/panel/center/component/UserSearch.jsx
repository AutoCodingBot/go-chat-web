import React, { useState, useRef, useEffect } from 'react';
import { Row, Button, Col, Menu, Dropdown, Input, Form, Modal, message ,Upload} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
// import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import UploadAvatar from "../../../common/components/UploadAvatar"

import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../redux/module/panel';
import * as Params from '../../../common/param/Params';
import { axiosGet, axiosPostBody } from '../../../util/Request';

const UserSearch = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.userInfoReducer.user);

    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [hasUser, setHasUser] = useState(false); //检索用户,群的modal
    const [queryUser, setQueryUser] = useState({ username: '', nickname: '' });
    const [imageAddr,setImageAddr] = useState('');
    const groupFormRef = useRef(null);
    const userList = useSelector(state => state.panelReducer.userList);

    // useEffect(() => {
    //     // componentDidMount logic can be placed here if needed.
    // }, []);

    const searchUser = (value, _event) => {
        if (!value.trim()) {
            return;
        }

        const searchData = {
            name: value
        };
        axiosGet(Params.USER_NAME_URL, searchData)
            .then(response => {
                const userData = response.data;
                if (!userData.user.username && !userData.group.name) {
                    message.error('未查找到群或者用户');
                    return;
                }
                const foundUser = {
                    username: userData.user.username,
                    nickname: userData.user.nickname,
                    groupUuid: userData.group.uuid,
                    groupName: userData.group.name,
                };
                setHasUser(true); //因为可以直接在搜索框检索,因此需要额外声明开启modal
                setQueryUser(foundUser);
            });
    };

    // const showModal = () => setHasUser(true);

    const addUser = () => {
        const addUserData = {
            uuid: localStorage.uuid,
            friendUsername: queryUser.username
        };
        axiosPostBody(Params.USER_FRIEND_URL, addUserData)
            .then(_response => {
                message.success('添加用户成功');
                setHasUser(false);
                //更新用户信息
                const updatedUserList = [...userList,{hasUnreadMessage:false,messageType:1,uuid:_response.data.uuid,username:_response.data.username}]
                dispatch(actions.setUserList(updatedUserList));
            });
    };

    const joinGroup = () => {
        axiosPostBody(`${Params.GROUP_JOIN_URL}${localStorage.uuid}/${queryUser.groupUuid}`)
            .then(_response => {
                message.success('加入群组成功');
                setHasUser(false);
            });
    };



    const createGroup = () => {
        const groupFormData = groupFormRef.current.getFieldsValue();
        const createGroupData = {
            name: groupFormData.groupName,
            groupDescribe:groupFormData.groupDescribe,
            avatar :imageAddr
        };
        console.log(createGroupData)
        return

        axiosPostBody(`${Params.GROUP_LIST_URL}/${localStorage.uuid}`, createGroupData)
            .then(_response => {
                message.success('创建群组成功');
                setShowCreateGroup(false);
            });
    };
    const handleImgChange = (imgAddr)=>{
        setImageAddr(imgAddr)
        console.log(imgAddr)
    }
    const menu = (
        <Menu>
            <Menu.Item key="1">
                <Button type='link' onClick={()=>setHasUser(true)}>添加用户</Button>
            </Menu.Item>
            {/* The second MenuItem for adding a group directly was misleading and not provided in the original class component logic. It's commented out but can be added with proper functionality if required. */}
            {/* <Menu.Item key="2">Add Group Logic Here</Menu.Item> */}
            <Menu.Item key="3">
                <Button type='link' onClick={()=>setShowCreateGroup(true)}>创建群</Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Row>
                <Col span={20}>
                    <Input.Group compact>
                        <Input.Search
                            allowClear
                            style={{ width: '100%' }}
                            onSearch={searchUser}
                        />
                    </Input.Group>
                </Col>
                <Col>
                    <Dropdown overlay={menu} placement="bottom" arrow>
                        <PlusCircleOutlined
                            style={{ fontSize: 22, color: 'gray', marginLeft: 3, marginTop: 5 }}
                        />
                    </Dropdown>
                </Col>
            </Row>

            <Modal
                title="用户信息"
                open={hasUser}
                onCancel={()=>setHasUser(false)}
                okText="添加用户"
                footer={null}
            >
                    <Input.Group compact>
                        <Input.Search allowClear style={{ width: '100%' }} onSearch={searchUser} />
                    </Input.Group>
                    <br /><hr /><br />

                    <p>用户名：{queryUser.username}</p>
                    <p>昵称：{queryUser.nickname}</p>
                    <Button type='primary' onClick={addUser} disabled={queryUser.username == null || queryUser.username === ''}>添加用户</Button>
                    <br /><br /><hr /><br /><br />

                    <p>群信息：{queryUser.groupName}</p>
                    <Button type='primary' onClick={joinGroup} disabled={queryUser.groupUuid == null || queryUser.groupUuid === ''}>添加群</Button>
            </Modal>

            <Modal
                title="创建群"
                open={showCreateGroup}
                onCancel={()=>setShowCreateGroup(false)}
                onOk={createGroup}
                okText="创建群"
            >
                <Form
                    name="groupForm"
                    ref={groupFormRef}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        name="groupName"
                        label="群名称"
                        rules={[{ required: true, message: '请输入群名称' }]}
                    >
                        <Input placeholder="群名称" />
                    </Form.Item>

                    <Form.Item
                        name="groupDescribe"
                        label="群描述"
                        rules={[{ required: true, message: '请输入群描述' }]}
                    >
                        <Input placeholder="群描述" />
                    </Form.Item>

                    <Form.Item
                        name="groupAvatar"
                        label="群头像"
                    >
                        {/* <Input hidden={true} value={imageAddr}/> */}

                    <UploadAvatar objectType="group" handleImgChange = {handleImgChange}/>


                    </Form.Item>


                </Form>
            </Modal>
        </>
    );
};

// Since mapStateToProps is not used in the component, we can skip the connect HOC.
// If Redux actions are still necessary, they can be dispatched via useDispatch as shown above.

export default UserSearch;