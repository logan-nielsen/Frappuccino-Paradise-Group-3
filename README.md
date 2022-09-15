# Dan's Frappuccino Paradise Group 3

This website manages orders for Dan's Frappuccino Paradise by allowing customers to place orders and allowing employees to view orders and mark when the orders are ready for pickup. It also allows the manager to restock the inventory and handles the payroll for the employees.  

## Workspace Layout

The Frappuccino Paradise website repository is managed using GitHub.

The source code of the project can be found in the 'app/' directory.

The documentation and other related files can be found in the 'docs/' directory.

## Version-Control Procedures

Each collaborator should create a new branch with a descriptive name whenever they start working on a new item in the project backlog.

Each collaborator should push the most recent version of each branch to GitHub before each meeting.

A branch should have working code when a pull request is made.

## Tool Stack Description and Setup Procedure

The Django framework is used both to create the server for the website and to manage the database.

React is used to build the frontend of the website.

A sqlite database is used to store data.

## Build Instructions

1. Clone the GitHub repository located at 'https://github.com/logan-nielsen/Frappuccino-Paradise-Group-3'
2. Install the virtualenv python package: ```$ pip install virtualenv```
3. Create and start a virtual environment: ```$ python -m virtualenv --no-site-packages```
4. Install the project dependencies: ```$ pip install -r requirements.txt```
5. Set up the database: ```$ python manage.py migrate```
6. Create an admin account: ```$ python manage.py createsuperuser```
7. Migrate again: ```$ python manage.py migrate```
8. Start the development server: ```$ python manage.py runserver```

## Unit Testing Instructions

The unit tests for the website can be run using the following command in the root directory of the project: ```$ ./manage.py test```.

More information on running unit tests in Django can be found at the following website: https://docs.djangoproject.com/en/4.1/topics/testing/overview/

## System Testing Instructions

The first step for system testing is to build the project and start a development server using the instructions found under the header "Build Instructions" of this document. Once the development server is running, use a web browser to navigate to the address ```localhost:8000```. 

Customer role can be tested using a test account the credentials Username: customerTest and Password: customerTest.

Barista role can be tested using a test account the credentials Username: baristaTest and Password: baristaTest.

The manager role can only be tested using the main manager account. This can be accessed using the manager's default credentials, which are Username: manager and Password: manager.
