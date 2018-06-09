const express = require('express')
const utils = require('utility')
const Router = express.Router()
const model = require('./model')

const User = model.getModel('user')
const Chat = model.getModel('chat')
const _filter = {'pwd': 0, '__v': 0}

// 删除聊天记录
//Chat.remove({}, function(e, d){})

Router.get('/list', function(req, res) {
    // 清除所有
    //User.remove({}, function(e,d){})
    const { type } = req.query
    User.find({type}, _filter, function(err, doc){
        return res.json({code:0, data:doc})
    })
})
Router.get('/getmsglist', function (req,res) {
  const user = req.cookies.userid
  User.find({}, function (e, userdoc) {
    let users = {}
    userdoc.forEach(v=>{
      users[v._id] = {name: v.user, avatar:v.avatar}
    })
    Chat.find({'$or':[{from:user},{to:user}]}, function (err, doc) {
      if(!err) {
        return res.json({code:0, msgs: doc, users: users})
      }
    })
  })
  
})

Router.post('/readmsg', function (req, res) {
  const userid = req.cookies.userid
  const {from} = req.body
  Chat.update({from, to:userid},{'$set':{read:true}},{'multi': true},function (err,doc) {
    if(!err){
      return res.json({code:0, num:doc.nModified})
    }
    return res.json({code:1,msg: '修改失败'})
  })
})
 
Router.post('/login', function(req, res) {
    const {user, pwd} = req.body
    User.findOne({user,pwd: md5Pwd(pwd)}, _filter, function(err, doc) {
        if(!doc) {
            return res.json({code: 1, msg: '用户名或密码错误'})
        }
        res.cookie('userid', doc._id)
        return res.json({code: 0, data: doc})
    })
})
Router.post('/register', function(req, res) {
    const {user, pwd, type} = req.body
    User.findOne({user}, _filter, function(err, doc) {
        if(doc) {
            return res.json({code: 1, msg: '用户名重复'})
        }
        // 为了拿到id并存储 所以用save的方式存储数据
        const userModel = new User({user, type, pwd: md5Pwd(pwd)})
        userModel.save(function(e, d) {
            if(e) {
                return res.json({code: 1, msg: '后端出错了'})
            }
            const {user, type, _id} = d
            res.cookie('userid', _id)
            return res.json({code: 0, data: {user, type, _id}})
        })
        // User.create({user, type, pwd: md5Pwd(pwd)}, function(e, d) {
        //     if(e) {
        //         return res.json({code: 1, msg: '后端出错了'})
        //     }
        //     return res.json({code: 0})
        // })
    })
})
Router.post('/update', function(req, res) {
    const {userid} = req.cookies
    if(!userid) {
        return json.dumps({code: 1})
    }
    const body = req.body
    User.findByIdAndUpdate(userid, body, function(err, doc) {
        const data = Object.assign({},{
            user: doc.user,
            type: doc.type
        }, body)
        console.log('data', data)
        return res.json({code: 0, data})
    })
})
Router.get('/info', function(req, res) {
    const {userid} = req.cookies
    if(!userid) {
        return res.json({code: 1})
    }
    User.findOne({_id: userid}, _filter, function(err, doc) {
        if(err) {
            return res.json({code: 1, msg: '后端出错了'})
        }
        if(doc) {
            return res.json({code: 0, data: doc})
        }
    })
})

// 两层md5加盐的方式
function md5Pwd(pwd) {
    const salt = 'CopyRight@Youwang_Deng'   
    return utils.md5(utils.md5(pwd+salt))
}
module.exports = Router