use employees;

INSERT INTO department
    (name)
VALUES
    ('Human Resources'),
    ('Marketing'),
    ('Information Technology'),
    ('Accounting');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('HR Manager', 100000, 1),
    ('HR', 50000, 1),
    ('Marketing Director', 140000, 2),
    ('Sales', 65000, 2),
    ('IT Director', 195000, 3),
    ('Desktop Support', 100000, 3),
    ('Account Manager', 110000, 4),
    ('Accountant', 90000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Alicia', 'Steele', 1, NULL),
    ('Marc', 'Gonzales', 2, 1),
    ('Calvin', 'Harris', 3, NULL),
    ('Shane', 'O'"'"'neill', 4, 3),
    ('Lizzie', 'Armanto', 4, 3),
    ('Sakura', 'Yosozumi', 5, NULL),
    ('Jerry', 'Huse', 6, 5),
    ('Andrew', 'Renolds', 6, 5),
    ('Dez', 'Williams', 7, NULL),
    ('Rayssa', 'Leal', 7, 8);
