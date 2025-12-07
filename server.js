//cadastro

const express = require("express")
const app = express()

app.use(express.json())

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//rota front end acessa

//CREATE USER
app.post('/usuarios', async (request, response) =>{ //funcao assincrona
    
    const {name, email, telefone} = request.body

    const user = await prisma.user.create({
        data: {
            name,
            email,
            telefone
        }
    })

    return response.status(200).send(user)
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
        const { name, telefone, email } = request.body

        const userUpdate = await prisma.user.update({
            where: {id},
            data: {name, telefone, email}
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