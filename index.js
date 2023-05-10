const express = require('express')
const app = express()

const objetojson = require('./json/employees.json');

app.use(express.json())

//6. GET http://localhost:8000/api/employees?user=true
app.get('/api/employees', (req, res, next) => {
    const user = req.query.user
    console.log(user)

    if(user === 'true'){
        const filteredEmployees = objetojson.filter(employee => employee.privileges === 'user');
        res.json(filteredEmployees);
    }

    next()
})

//8. GET http://localhost:8000/api/employees?badges=black
app.get('/api/employees', (req, res, next) => {
    const badges = req.query.badges
    console.log(badges)

    if(badges === 'black'){
        //busca un valor black en array de valores en el atributo badges
        const employeesbadgesblack = objetojson.filter(obj => obj.badges.includes("black"));
        res.json(employeesbadgesblack);
    }

    next()
})

//1. GET http://localhost:8000/api/employees
//2. GET http://localhost:8000/api/employees?page=1
//3. GET http://localhost:8000/api/employees?page=2
//4. GET http://localhost:8000/api/employees?page=N

app.get('/api/employees', (req, res, next) => {
    const page = req.query.page;
    const pageInt = parseInt(page);

    if (!isNaN(pageInt) && pageInt > 0) {
        const inicio = (2 * (pageInt - 1));
        const fin = (2 * (pageInt - 1)) + 2;
        const paginatedEmployees = objetojson.slice(inicio, fin);
    
        if (paginatedEmployees.length > 0) {
        res.status(200).json(paginatedEmployees);
        } else {
        res.status(404).json({ error: "No employees found" });
        }
    } else {
        res.status(201).json(objetojson);
    }

})


//5. GET http://localhost:8000/api/employees/oldest
app.get('/api/employees/oldest', (req, res, next) => {
    let edadMaxima = 0;
    let oldestPerson = null;

    for (const obj of objetojson) {
        if (obj.age > edadMaxima) {
            edadMaxima = obj.age;
            oldestPerson = obj;
        }
    }
    res.status(201).json(oldestPerson);

    next()
})


//9. GET http://localhost:8000/api/employees/NAME
app.get('/api/employees/:name', (req, res) => {
    const name  = req.params.name;
    console.log(name)
    const filteredEmployees = objetojson.filter(employee => employee.name === name);
  
    if (filteredEmployees.length === 0) {
      res.status(404).json({ code: "not_found" });
    } else {
      res.json(filteredEmployees);
    }
});


//7. POST http://localhost:8000/api/employees
app.post('/api/employees', (req, res, next) => {
    const employee = req.body
  
    // Validar el formato JSON del body
    if (isValidEmployee(employee)) {
        objetojson.push(employee);
        res.status(200).json(employee)
    }
    else{
        res.status(400).json({ code: 'bad_request' })
    }
})
  
// Función para validar el formato JSON de un empleado
function isValidEmployee(employee) {
    // Verificar si el objeto tiene las propiedades requeridas
    if (
      !employee.name || !employee.age ||
      !employee.phone || !employee.privileges ||
      !employee.favorites || !employee.finished ||
      !employee.badges || !employee.points
    ) {
      return false;
    }
  
    // Verificar si el tipo de cada propiedad es correcto
    if (
      typeof employee.name !== 'string' ||
      typeof employee.age !== 'number' ||
      typeof employee.phone !== 'object' ||
      typeof employee.privileges !== 'string' ||
      typeof employee.favorites !== 'object' ||
      !Array.isArray(employee.finished) ||
      !Array.isArray(employee.badges) ||
      !Array.isArray(employee.points)
    ) {
      return false;
    }

    return true;
}

//PUERTO
app.listen(8000, () => {
    console.log('Tarea API 1 - NODE JS - port 8000! ')
})
