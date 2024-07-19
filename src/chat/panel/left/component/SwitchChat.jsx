import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import * as Params from '../../../common/param/Params';
import { axiosGet } from '../../../util/Request';
import { actions } from '../../../redux/module/panel';

const SwitchChat = () => {
    const dispatch = useDispatch();
    // const userList = useSelector(state => state.userInfoReducer.user);
    const [menuType, setMenuType] = useState(1);

    useEffect(() => {
        fetchUserList()
    }, []); 


    const fetchUserList = () => {
        setMenuType(1);
        const data = {
            uuid: localStorage.uuid
        };
        axiosGet(Params.USER_LIST_URL, data)
            .then(response => {
                const users = response.data || [];
                const userData = users.map(user => ({
                    hasUnreadMessage: false,
                    username: user.username,
                    uuid: user.uuid,
                    messageType: 1,
                    avatar: user.avatar ?  
                    `${Params.HOST}/file/${user.avatar}` :
                    `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.username}`,
                }));
                dispatch(actions.setUserList(userData));
            });
    };

    const fetchGroupList = () => {
        setMenuType(2);
        const data = {
            uuid: localStorage.uuid
        };
        axiosGet(Params.GROUP_LIST_URL + "/" + localStorage.uuid, data)
            .then(response => {
                const groups = response.data || [];
                const groupData = groups.map(group => ({
                    username: group.name,
                    uuid: group.uuid,
                    messageType: 2,
                }));
                dispatch(actions.setUserList(groupData));
            });
    };

    return (
        <div style={{ marginTop: 25 }}>
            <p>
                <Button
                    icon={<UserOutlined />}
                    size="large"
                    type="link"
                    disabled={menuType === 1}
                    onClick={fetchUserList}
                    style={{ color: menuType === 1 ? '#1890ff' : 'gray' }}
                />
            </p>
            <p onClick={fetchGroupList}>
                <Button
                    icon={<TeamOutlined />}
                    size="large"
                    type="link"
                    disabled={menuType === 2}
                    style={{ color: menuType === 2 ? '#1890ff' : 'gray' }}
                />
            </p>
        </div>
    );
};

export default SwitchChat;