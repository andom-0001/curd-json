const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;
app.use(express.json());

const file = "data.json";

const readData = () => {
    return JSON.parse(fs.readFileSync(file));
}

const writeData = (data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

app.post('/users', (req, res) => {
    const users = readData();
    const { name, email, age, city } = req.body;
    if (!name || !email){
        return res.status(400).send({ error: "Name and Email are required" });
    }
    const dataexist = users.find(key => key.email === email);
    if (dataexist) {
        return res.status(400).send({ error: "User with this email already exists" });
    }
    const newUser = {
        id: users.length ? users[users.length].id + 1 : 1,
        name,
        email,
        age,
        city
    };
    users.push(newUser);
    writeData(users);
    res.status(201).json(newUser);
});

app.get('/users', (req, res) => {
    const users = readData();
    let result = users;
    res.json(result);
});

app.get('/users/:id', (req, res) => {
    const users = readData();
    const ids= users.find(key => key.id == req.params.id);
    if (!ids) {
        return res.status(404).send({ error: "User not found" });
    }
    res.json(ids);
});

app.put('/users/:id', (req, res) => {
    let users = readData();
    let idx = users.findIndex(key => key.id == req.params.id);
    if(idx === -1){
        return res.status(404).send({error: "User not found"});
    }
    if(req.body.email){
        const emailExist = users.find(key =>key.email === req.body.email && key.id != req.params.id);
        if(emailExist){
            return res.status(400).send({error: "Email already in use"});
        }
    }
    users[idx] = { 
        ...users[idx], ...req.body
    };
    writeData(users);
    res.json(users[idx]);
});

app.listen(PORT, () => {
    console.log(`Server is running on port  http://localhost:${PORT}`);
});