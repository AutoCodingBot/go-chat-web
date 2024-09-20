import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Avatar,
    Drawer,
    List,
    Badge,
    Card,
    Comment,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MoreOutlined } from '@ant-design/icons';
// import { actions } from '../../../redux/module/panel';
import * as Params from '../../../common/param/Params';
import { axiosGet } from '../../../util/Request';

const CommentList = ({ comments }) => (
    <InfiniteScroll
        dataLength={comments.length}
        scrollableTarget="scrollableDiv"
    >
        <List
            dataSource={comments}
            itemLayout="horizontal"
            renderItem={props => <Comment {...props} />}
        />
    </InfiniteScroll>
);

const ChatDetails = () => {
    // const dispatch = useDispatch();
    const chooseUser = useSelector(state => state.panelReducer.chooseUser);
    // {toUser: 'affec7bb-8565-4cad-a05f-63a3334c53a2', toUsername: '木兰辞', messageType: 2, avatar: undefined}
    const messageList = useSelector(state => state.panelReducer.messageList);
    // console.log(chooseUser)
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [groupUsers, setGroupUsers] = useState([]);

    useEffect(() => {
        if (messageList.length > 0) {
            scrollToBottom();
        }
    }, [messageList]);

    //下拉到底
    const scrollToBottom = useCallback(() => {
        const div = document.getElementById("scrollableDiv");
        if (div) {
            div.scrollTop = div.scrollHeight;
        }
    }, []);

    const chatDetails = useCallback(() => {
        axiosGet(`${Params.GROUP_USER_URL}${chooseUser.toUser}`)
            .then(response => {
                if (response.data) {
                    setGroupUsers(response.data);
                    setDrawerVisible(true);
                }
            });
    }, [chooseUser.toUser]);

    const drawerOnClose = () => {
        setDrawerVisible(false);
    };



    return (
        <>
        <Badge.Ribbon 
              text={
                chooseUser.messageType === 2 ?
                  <MoreOutlined onClick={chatDetails} /> :
                  null
              }
        >

                <Card title={chooseUser.toUsername} size="large">
                    <div
                        id="scrollableDiv"
                        style={{
                            height: `calc(${document.body.scrollHeight}px / 3 * 1.4)`,
                            overflow: 'auto',
                            padding: '0 16px',
                            border: '0px solid rgba(140, 140, 140, 0.35)',
                        }}
                    >
                        {messageList.length > 0 && <CommentList comments={messageList} />}
                    </div>
                </Card>

            </Badge.Ribbon>

            <Drawer title="成员列表" placement="right" onClose={drawerOnClose} open={drawerVisible}>
                <List
                    itemLayout="horizontal"
                    dataSource={groupUsers}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                style={{ paddingLeft: 30 }}
                                avatar={<Avatar src={`${Params.HOST}/file/${item.avatar}`} />}
                                title={item.username}
                                description=""
                            />
                        </List.Item>
                    )}
                />
            </Drawer>
        </>
    );
};

export default ChatDetails;