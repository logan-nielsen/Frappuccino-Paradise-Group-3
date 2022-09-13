# Dan's Frappuccino Paradise Group 3

This website manages orders for Dan's Frappuccino Paradise by allowing customers to place orders and allowing employees to view orders and mark when the orders are ready for pickup. It also allows the manager to restock the inventory and handles the payroll for the employees.  

## Workspace Layout

The Frappuccino Paradise website repository is be managed using GitHub.

The source code of the project can be found in the 'app/' directory.

The documentation and other related files can be found in the 'docs/' directory.

## Version-Control Procedures

Each collaborator should create a new branch with a descriptive name whenever they start working on a new item in the project backlog.

Each collaborator should push the most recent version of each branch to GitHub before each meeting.

A branch should have working code when a pull request is made.

## Tool Stack Description and Setup Procedure

The Django framework is used both to create the server for the website and to manage the database.

React is used to build the frontend of the website.

A sqlite database is used store data.

## Build Instructions

1. Clone the GitHub repository located at 'https://github.com/logan-nielsen/Frappuccino-Paradise-Group-3'
2. Install the virtualenv python package: ```$ pip install virtualenv```
3. Create and start a virtual environment: ```$ python -m virtualenv --no-site-packages```
4. Install the project dependencies: ```$ pip install -r requirements.txt```
5. Set up the database: ```$ python manage.py migrate```
6. Create an admin account: ```$ python manage.py createsuperuser```
7. Migrate again: ```$ python manage.py migrate``` TODO: Is this step needed?
8. Start the development server: ```$ python manage.py runserver```

## Unit Testing Instructions

TODO: Add unit testing instructions

## System Testing Instructions

TODO: Add system testing instructions