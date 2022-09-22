const {prompt} = require("inquirer");
const db = require("./db");
require("console.table");

init();
// start application NPM start
function init() {
    runPrompts();
}
// application prompts
function runPrompts() {
    prompt([
        {
            type: "list",
            name:"choice",
            message:"What would you like todo?",
            choices:[
                {
                    name: "View Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "View Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "View Employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENTS"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
        }
        // choices to select from
    ]).then(res => {
        let choice = res.choice;
        switch (choice) {
            case "VIEW_DEPARTMENTS":
                viewAllDepartments();
                break;
            case "VIEW_ROLES":
                viewAllRoles();
                break;
            case "VIEW_EMPLOYEES":
                viewAllEmployees();
                break;
            case "ADD_DEPARTMENTS":
                createDepartment();
                break;
            case "ADD_ROLE":
                createRole();
                break;
            case "ADD_EMPLOYEE":
                createEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            default:
                quit();
        
        }
    })
}

// view employees
function viewAllEmployees() {
    db.allEmployees()
    .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
    })
    .then(() => runPrompts());
}

// view roles
function viewAllRoles() {
    db.allRoles()
    .then(([rows]) => {
        let roles = rows;
        console.log("\n");
        console.table(roles);
    })
    .then(() => runPrompts());
}

// view departments
function viewAllDepartments(){
    db.allDepartments()
    .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
    })
    .then(() => runPrompts());
}

//add role
function createRole() {
    db.allDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id,name}) => ({
            name:name,
            value:id
        }));

        prompt([
            {
                name: "title",
                message: "What is the name of the role?"
            },
            {
                name: "salary",
                message: "What is the salary rate?"
            },
            {
                type:"list",
                name:"department_id",
                message:"Which department does the role fall under?",
                choices: departmentChoices
            }
        ])
            .then(role => {
                db.addRole(role)
                .then(()=> console.log(`Added ${role.title} to the database`))
                .then(() => runPrompts())
            })
    })
}

// add department
function createDepartment() {
    prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
        .then(res => {
            let name = res;
            db.addDepartment(name)
                .then(() => console.log(`Added ${name.name} to the database`))
                .then(() => runPrompts())
        })
}

// add employee
function createEmployee() {
    prompt([
        {
            name:"first_name",
            message:"What is the employees first name?"
        },
        {
            name:"first_last",
            message:"What is the employees last name?"
        }
    ])
        .then(res => {
            let firstName = res.first_name;
            let lastName = res.last_name;

            db.allRoles()
            .then(([rows])=> {
                let roles = rows;
                const roleChoices = roles.map(({id,title}) => ({
                    name: title,
                    value:id
                }));

                prompt({
                    type:"list",
                    name: "roleId",
                    message: "What is the employees role?",
                    choices: roleChoices
                })
                .then(res => {
                    let roleId = res.roleId;

                    db.allEmployees()
                        .then(([rows])=> {
                            let employees = rows;
                            const managerChoices = employees.map(({id,first_name,last_name}) => ({
                                name: `${first_name} ${last_name}`,
                                value: id
                            }));
                            managerChoices.unshift({name: "None", value: null});

                            prompt({
                                type: "list",
                                name: "managerId",
                                message: "Who's the employee's manager?",
                                choices: managerChoices
                            })
                                .then(res => {
                                    let employee = {
                                        manager_id: res.managerId,
                                        role_id: roleId,
                                        first_name: firstName,
                                        last_name: lastName
                                    }
                                    db.addEmployee(employee);
                                })
                                .then(() => console.log(
                                    `Added ${firstName} ${lastName} to the database`
                                ))
                                .then(() => runPrompts())
                        })
                })
            })
        })
}

// update employee role
function updateEmployeeRole() {
    db.allEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee's role do you want to update?",
                    choices: employeeChoices
                }
            ])
                .then(res => {
                    let employeeId = res.employeeId;
                    db.allRoles()
                        .then(([rows]) => {
                            let roles = rows;
                            const roleChoices = roles.map(({ id, title }) => ({
                                name: title,
                                value: id
                            }));

                            prompt([
                                {
                                    type: "list",
                                    name: "roleId",
                                    message: "What's the new role of this employee?",
                                    choices: roleChoices
                                }
                            ])
                                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                                .then(() => console.log("Employee's role is updated"))
                                .then(() => runPrompts())
                        });
                });
        })
}
// quit application
function quit() {
    process.exit();
}