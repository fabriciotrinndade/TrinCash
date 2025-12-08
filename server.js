require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const path = require('path');
const { request } = require('http')

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//AUTH autenticação
function authToken(request, response, next) {
    const authHeader = request.headers['authorization']

    const token = authHeader?.split(' ')[1]

    if (!token) return response.sendStatus(401)

        jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
            if (err) return response.sendStatus(401)
                request.user = user
            next()
        })
}
    

//LOGIN INICIO
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'public', 'login.html'));
});

//CREATE USER
app.post('/registrar', async (request, response) =>{ //funcao assincrona
    
    const {email, password} = request.body

    const verificaUser = await prisma.user.findFirst({
        where: {email}
    })

    if (verificaUser) {
        return response.status(400).send("Email já cadastrado")
    }

    const user = await prisma.user.create({
        data: {
            email,
            password
        }
    })

    return response.redirect('/login.html')
})

//LOGIN
app.post('/login', async ( request, response) =>{

    const { email, password} = request.body

     const users = await prisma.user.findFirst({
            where: {email, password}
        })

        if (!users) {
            return response.status(404).send("Credenciais inválidas")
        } 

            const token = jwt.sign({ id: users.id },process.env.JWT_SECRET, { expiresIn: '1h'})
            response.json({token})
       
})


app.get('/dashboard', authToken, ( request, response) =>{
    response.sendFile(path.join(__dirname,'private', 'dashboard.html'))
})





//READ ALL
    app.get('/usuarios', async (request, response) => {

        const users = await prisma.user.findMany()

        return response.status(200).send(users)
    })

//READ ID
    app.get('/buscar/usuario/:id', async (request, response) => {

        const id = request.params.id

        const users = await prisma.user.findUnique({
            where: {id}
        })

        return response.status(200).send(users)
    })

//UPDATE USER
    app.put('/editar/usuario/:id', async ( request, response) => {

        const id = request.params.id
        const { email, password } = request.body

        const userUpdate = await prisma.user.update({
            where: {id},
            data: {email, password}
        })

        return response.status(200).send(userUpdate)
    })

//DELETE USER
    app.delete('/usuarios/deletar/:id', async ( request, response) =>{
        const id = request.params.id

        const userDeleted = await prisma.user.delete({
            where: {id}
        })
        
        return response.status(200).send(userDeleted)
    })


app.listen(3333, () => {
    console.log("Server running")
})