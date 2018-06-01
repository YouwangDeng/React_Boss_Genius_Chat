import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadData } from '../../redux/user.redux'

@withRouter
@connect(
    null,
    { loadData }
)
class AuthRoute extends React.Component{
    componentDidMount() {
        const publicList = ['/login','/register']
        const pathname = this.props.location.pathname
        if(publicList.indexOf(pathname) > -1) {
            return null
        }
        // 获取用户信息
        axios.get('/user/info')
        .then(res => {
            if(res.status === 200){
                if(res.data.code === 0) {
                    // 有登录信息
                    this.props.loadData(res.data.data)
                }else{
                    this.props.history.push('/login')
                }
                //console.log(res.data)
            }
        })
        // 是否登录
        // 现在的url 地址  
        // 用户身份
        // 用户信息是否完善
    }
    render() {
        return null
    }
}
export default AuthRoute