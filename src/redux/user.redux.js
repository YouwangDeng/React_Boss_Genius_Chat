import axios from 'axios'
import { getRedirectPath } from '../utils'

// const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
// const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const ERROR_MSG = 'ERROR_MSG'
const LOAD_USER = 'LOAD_USER'
const LOGOUT = 'LOGOUT'

const initState = {
    redirectTo: '',
    msg: '',
    user: '',
    type: ''
}

// reducer
export function user(state=initState, action){
    switch(action.type){
        case AUTH_SUCCESS:
            return {...state, msg: '',redirectTo: getRedirectPath(action.payload), ...action.payload}
        case LOAD_USER: 
            return {...state, ...action.payload}
        case ERROR_MSG:
            return {...state, isAuth: false, msg: action.msg}
        case LOGOUT:
            return {...initState, redirectTo: '/login'}
        default: 
            return state
    }
}
function errorMsg(msg){
    return { msg, type: ERROR_MSG }
}

function authSuccess(obj) {
    // 过滤掉pwd
    const {pwd, ...data} = obj
    return {type: AUTH_SUCCESS, payload: data}
}
export function loadData(userinfo) {
    return {type: LOAD_USER, payload: userinfo}
}
export function logoutSubmit() {
    return {type: LOGOUT}
}
export function register({user, pwd, repeatpwd, type}) {
    if(!user || !pwd || !type) {
        return errorMsg('用户名密码必须输入')
    }
    if(pwd !== repeatpwd){
        return errorMsg('两次密码不一致')
    }
    return dispatch => {
        axios.post('/user/register', {user, pwd, type})
        .then(res => {
            if(res.status === 200 && res.data.code === 0){
                dispatch(authSuccess({user, pwd, type}))
            }else{
                dispatch(errorMsg(res.data.msg))
            }
        })
    }
}

export function login({user, pwd}) {
    if(!user || !pwd) {
        return errorMsg('用户名密码必须输入')
    }
    return dispatch => {
        axios.post('/user/login', {user, pwd})
        .then(res => {
            if(res.status === 200 && res.data.code === 0){
                dispatch(authSuccess(res.data.data))
            }else{
                dispatch(errorMsg(res.data.msg))
            }
        })
    }
}

export function update(data) {
    return dispatch => {
        axios.post('/user/update', data)
            .then((res) => {
                if(res.status === 200 && res.data.code === 0){
                    dispatch(authSuccess(res.data.data))
                }else{
                    dispatch(errorMsg(res.data.msg))
                }
            })
    }
}