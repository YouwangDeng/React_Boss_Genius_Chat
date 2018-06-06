import React from 'react'
import { NavBar, InputItem, TextareaItem, Button, WhiteSpace } from 'antd-mobile'
import AvatarSelecter from '../../component/avatar-selecter/avatar-selecter'
import { connect } from 'react-redux'
import { update } from '../../redux/user.redux'
import { Redirect } from 'react-router-dom';

@connect(
    state=>state.user,
    { update }
)
class GeniusInfo extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            'title': '',
            'desc': ''
        }
        // this.onChange = this.onChange.bind(this)
        this.selectAvatar = this.selectAvatar.bind(this)
    }
    onChange(key, val) {
        this.setState({
            [key]: val
        })
    }
    selectAvatar(imageName) {
        this.setState({
            avatar: imageName
        })
        console.log(this.state)
    }
    render() {
        const path = this.props.location.pathname
        const redirect = this.props.redirectTo
        return (
            <div>
                {redirect && redirect !== path ? <Redirect to={this.props.redirectTo} /> : null}
                <NavBar mode="dark" >牛人完善信息页</NavBar>
                <AvatarSelecter selectAvatar={this.selectAvatar}></AvatarSelecter>
                <InputItem onChange={(v) => this.onChange('title',v)}>求职岗位</InputItem>
                <TextareaItem 
                    onChange={(v) => this.onChange('desc',v)}
                    title="个人简介"
                    placeholder="请输入个人简介..."
                    rows={3}
                    autoHeight
                    count={100}
                ></TextareaItem>
                <WhiteSpace></WhiteSpace>
                <Button type='primary' onClick={()=>{this.props.update(this.state)}}>保存</Button>
            </div>
        )
    }
}

export default GeniusInfo