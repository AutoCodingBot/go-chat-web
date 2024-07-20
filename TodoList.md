### 素材库 
https://www.svgrepo.com/
https://api.dicebear.com/9.x/pixel-art/svg?seed=URSEED

### Todo list
router 独立  `checked` ,升级成v6 `checked`

鉴权,已登录状态不能访问login  `checked` 

收到消息,滴滴提醒  `checked` 顺手加了发送音效

好友,群列表,可被重复点击,重复向后端发送请求 `checked`

switch组件,切换用户和群聊,都会向后端请求 本地缓存?但本地缓存又如何判断是否最新?


添加好友(群),无法立即加载,必须 真·刷新


分页加载历史聊天记录,参考:https://ant-design.antgroup.com/components/list-cn#listitemmeta

聊天窗口,参考:https://daisyui.com/components/chat/

未读消息,必须点击其他人才能提示;并仅能提示一次

自己能添加自己,自己给自己发消息,会重复消息;解决思路,将自己改成"文件传输助手",消息记录存单独表,关闭socket推送机制
