#API
Simple rules here:

* Params with method `POST` should be a `JSON`.
* All results will be a `JSON`.
* The result contains `error` and `error_code` if some errors occurs.

## 
## Auth API

### /login
Login with email and password. It will use `session` in cookie if no email or password provided.
* Method: `POST`
* Params:
  * `email`
  * `password`
* Return:

### /register
Register with email and password.
* Method: `POST`
* Params:
  * `email`
  * `password`
* Return:

### /verify
verify url from user's email-box (including CONFIRM mail and FORGET_PASS mail). Whether verify succeed or failure, this API will redirect user to a Html.
* Method: `GET`
* Params:
  * `code`
* Return:

## 
## User

### /my
### /my/task
* method: `GET`
* Params:
* Return:
  * `tasks`: Array of `simple_task`
    * `simple_task`:
      * `id`
      * `title`
      * `complete`
      * `assignee`
      * `sort`
      * `tags`
      * `projects` 

### /my/profile
* method: `GET` / `POST`
* Params:
* Return:
  * Not finished.

### /my/project
* method: `GET`
* Params:
* Return:
  * Not finished.

### /person/:id
* method: `GET`
* Params:
* Return:
  * Not finished.

## 
## Task / Project

### /task
Post a new Task
* Method: `POST`
* Params:
  * Not finished.
* Return:
  * Not finished.

### /task/:id
`GET`: Get a task with detailed,
`POST`: Modify the task
* method: `GET` / `POST`
* Params:
  * same as POST /task .
* Return:
  * same as POST /task .

### /task/:id/assign
assign the task to someone or parent task
* method: `POST` / `DELETE`
* Params:
  * `target`: target task's id or person's id
  * `type`: assign to target `task` or target `person`
  * `sort`: sort
* Return:
  * Not finished.


### /task/:id/sub
Get subtasks of the task
* method: `GET`
* Params:
* Return:
  * `tasks`: Array of `simple_task`

### /task/:id/comment
`GET`: Get comments of the task, `POST`: Post a new comment for the task.
* method: `GET` / `POST`
* Params:
  * Not finished.
* Return:
  * Not finished.

### /project/:id
Get project info
* method: `GET`
* Params:
* Return:
  * Not finished.

### /project/:id/task
Get tasks of the project(or task)
* method: `GET`
* Params:
  * Not finished.
* Return:
  * `tasks`: Array of `simple_task`

## 
## Search

### /search
* method: `POST`
* Params:
  * Not finished.
* Return:
  * `tasks`: Array of `simple_task`

## Sample
### /sample
URI Summary here.
* Method: `POST` or `GET` or else
* Params:
  * `p1`
  * `p2` with some note here.
* Return:
  * `key1`
  * `key2` with some note here.
