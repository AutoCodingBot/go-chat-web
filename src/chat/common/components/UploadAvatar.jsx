import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import * as Params from '../param/Params';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { message } from 'antd';

const UploadAvatar = (props)=>{
    const fileUploadHeader = {
        "Authorization": "Bearer "+ localStorage.getItem("ACCESS_TOKEN"),
    }
    const user = useSelector(state => state.userInfoReducer.user);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(user.avatar);

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
                getBase64(info.file.originFileObj, (imageUrl) => {
                    setImageUrl(imageUrl);
                    setLoading(false);
                });

                props.handleImgChange(response.data)
            }
        }
    };
    
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
    return(
        <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            style={{position: 'relative'}}
            showUploadList={false}
            action={Params.FILE_URL}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            headers={fileUploadHeader}
            // data={{ objectType: props.objectType}}
        >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '40%',position:'absolute' }} /> : loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </Upload>   
    )
}
export default UploadAvatar