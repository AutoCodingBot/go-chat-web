import React, { useEffect } from 'react';
import SwitchChat from './component/SwitchChat'
import UserInfo from './component/UserInfo'
import { useNavigate } from 'react-router-dom';



const LeftIndex = (props)=>{
    const navigate = useNavigate()
    const redirectCon = ()=>{
        const accessToken = localStorage.getItem("ACCESS_TOKEN")
        if(!accessToken){
            navigate("/login")
        }
    }
    useEffect(()=>{
        redirectCon()
    },[])
    return (
        <div style={{ marginTop: 10 }}>
            <UserInfo history={props.history} />
            <SwitchChat />
        </div>
    );
}
export default LeftIndex
/*
export default class LeftIndex extends React.Component {

    render() {

        return (
            <div style={{ marginTop: 10 }}>
                <UserInfo history={this.props.history} />
                <SwitchChat />
            </div>
        );
    }
}
    */
