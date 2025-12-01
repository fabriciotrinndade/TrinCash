//cadastro

//fabriciotrindade2001_db_user    zBK02XfVHRMdlmX8

const express = require("express")
const app = express()

app.use(express.json())

let usuarios = []
let id = 1

//rota front end acessa
app.post('/usuarios', (request, response) =>{
    
    const {name, email, telefone} = request.body

    const user = {
        id: id++,
        name: name,
        email: email,
        telefone: telefone,
        criadoEm: new Date()
    }
    
    
    usuarios.push(user)

    return response.status(200).send(user)
})
    
    app.get('/usuarios', (request, response) => {
        return response.status(200).send(usuarios)
    })
    
    app.get('/buscar/usuario/:id', (request, response) => {

        const id = request.params.id

        const indexUsuario = usuarios.find(usuario => usuario.id == id)

        if(!indexUsuario){
            return response.status(404).send({message:"Usuário não encontrado"})
        }

        return response.status(200).send(indexUsuario)
    })


app.listen(3333, () => {
    console.log("Server running")
})