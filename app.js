const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./models');

const SECRET = 'sdnjsdfksalnfsak'; // 随便写什么
const app = new express()

app.use(express.json())


app.get('/api/users', async (req, res) => {
    const users = await User.find()
    res.send(users)
})

app.post('/api/register', async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    res.send(user)
})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    if (!user) {
        return res.status(422).send({
            message: '用户不存在'
        })
    }
    const isPasswordVaild = bcrypt.compareSync(req.body.password, user.password)

    if (!isPasswordVaild) {
        return res.status(422).send({
            messgae: '密码无效'
        })
    }

    const token = jwt.sign({
        id: String(user._id)
    }, SECRET)

    res.send({
        user,
        token: token
    })
})

const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop()
    const {id} = jwt.verify(raw, SECRET)
    req.user = await User.findById(id)   
    next()
}

app.get('/api/profile', auth, async (req, res) => {
    res.send(req.user)
})

app.listen(3000, () => {
    console.log('listening to port 3000')
})