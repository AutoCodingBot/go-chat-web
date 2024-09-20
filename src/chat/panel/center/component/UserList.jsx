import React, { useState,useCallback} from 'react';
import { List, Badge, Avatar } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../redux/module/panel';
import * as Params from '../../../common/param/Params';
import { axiosGet } from '../../../util/Request';

const UserList = () => {
    const [chooseUser, setChooseUserState] = useState({});//当前用户card
    const dispatch = useDispatch();
    const userList = useSelector(state => state.panelReducer.userList);
    const chooseUserHandler = (value) => {
        //value是在Switch中渲染并提交给redux管理的数据
        // value: {hasUnreadMessage: false, username: 'sam', uuid: 'c0fd020f-fa4d-4379-8f8b-f84a07fadd6a', messageType: 1, avatar: 'http://localhost:8888/file/55f72d82-a814-41fa-bc77-08b05e9b4287.jpg'}
        
        //修复可重复点击用户card,导致重复发起请求的bug
        //注意,useState是异步的,因此下面代码是合理的
        setChooseUserState(value.username)
        if(value.username === chooseUser){
            return
        }
        const newUser = {
            toUser: value.uuid,
            toUsername: value.username,
            messageType: value.messageType,
            avatar: value.avatar
        };
        fetchMessages(newUser);
        removeUnreadMessageDot(value.uuid);
    };

    const fetchMessages = useCallback((chooseUser) => {
        const { messageType, toUser, toUsername } = chooseUser;
        // let uuid = localStorage.uuid;
        // if (messageType === 2) {
        //     uuid = toUser;
        // }
        let data = {
            Uuid: toUser,
            FriendUsername: toUsername,
            MessageType: messageType
        };
        axiosGet(Params.MESSAGE_URL, data)
            .then(response => {
                
                if(response.data.messageList){
                    // console.log('chat detail',response.data)
                    const comments = response.data.messageList.map(item => ({
                        author: item.fromUsername,
                        avatar: item.avatar ? `${Params.HOST}/file/${item.avatar}` : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${item.fromUsername}`,
                        content: getContentByType(item.contentType, item.url, item.content),
                        datetime: moment(item.createAt).fromNow(),
                    }));
                    dispatch(actions.setMessageList(comments));
                }else{
                    dispatch(actions.setMessageList([]));
                }
                dispatch(actions.setChooseUser(chooseUser));


            });
    }, [dispatch]);

    const getContentByType = (type, url, content) => {
        switch (type) {
            case 2: return <FileOutlined style={{ fontSize: 38 }} />;
            case 3: return <img src={`${Params.HOST}/file/${url}`} alt="" width="150px" />;
            case 4: return <audio src={`${Params.HOST}/file/${url}`} controls autoPlay={false} preload="auto" />;
            case 5: return <video src={`${Params.HOST}/file/${url}`} controls autoPlay={false} preload="auto" width='200px' />;
            default: return content;
        }
    };
    //移除红点
    const removeUnreadMessageDot = useCallback((toUuid) => {
        const updatedList = userList.map(user => {
            if (user.uuid === toUuid) {
                return { ...user, hasUnreadMessage: false };
            }
            return user;
        });
        dispatch(actions.setUserList(updatedList));
    }, [userList, dispatch]);

    const formatUsernameWithStatus = (username, onlineStatus)=> {
        return onlineStatus ? username : `${username} (Offline)`;
      }
      
    return (
        <div id="userList" style={{
            height: `calc(100vh - 125px)`,
            overflow: 'auto',
        }}>
            <InfiniteScroll
                dataLength={userList.length}
                scrollableTarget="userList"
            >
                <List
                    itemLayout="horizontal"
                    dataSource={userList}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                style={{ paddingLeft: 30 ,backgroundColor: chooseUser === item.username ? '#87CEFA' : 'transparent'}}
                                onClick={() => chooseUserHandler(item)}
                                avatar= {<Badge dot={item.hasUnreadMessage}><Avatar src={item.avatar || `https://api.dicebear.com/9.x/pixel-art/svg?seed=${item.username}`} /></Badge>}
                                title={formatUsernameWithStatus(item.username,item.onlineStatus)}
                                description="Latest msg"
                                // description 用来加载最后一条消息
                            />
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </div>
    );
};

export default UserList;
/*
useSelector 是React-Redux库中的一个Hook，
它允许你在React函数组件中访问Redux store中的数据，而无需显式地订阅store或手动调用dispatch来更新组件状态。
这是React函数式组件与Redux store进行交互的关键桥梁，使得你可以非常便捷地在组件中获取到全局状态。
*/