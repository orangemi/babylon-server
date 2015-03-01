#API
Simple rules here:

* Params with method `POST` should be a `JSON`.
* All results will be a `JSON`.
* The result contains `error` and `error_code` if some errors occurs.

## 
## Auth API

### `POST` /login
Login with email and password. It will use `session` in cookie if no email or password provided.
* Params:
  * `email`
  * `password`
* Return:

### `POST` /register
Register with email and password (Not finished)
* Params:
  * `email`
  * `password`
* Return:

### `GET` /verify
verify url from user's email-box (including CONFIRM mail and FORGET_PASS mail). Whether verify succeed or failure, this API will redirect user to a Html.
* Params:
  * `code`
* Return:

## 
## User

### `GET` /my
* Params:
* Return:
  * (Not finished)

### `GET` /my/task
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

### `GET` /my/profile (Not finished)
* Params:
* Return:
  * Not finished.

### `POST` /my/profile (Not finished)
* Params:
  * Not finished.
* Return:
  * Not finished.

### `GET` /my/project
* Params:
* Return:
  * Not finished.

### `GET` /person/:id
* Params:
* Return:
  * Not finished.

## 
## Task / Project

### `POST` /task
Post a new Task
* Params:
  * Not finished.
* Return:
  * `simple_task` structure.
  * Not finished.

### `GET` /task/:id (Not finished)
Get a task with detailed info,
* Params:
* Return:
  * same as POST /task .

### `GET` /task/:id
Modify the task
* Params:
  * same as `POST` /task
* Return:
  * same as `POST` /task

### `POST` /task/:id/assign
assign the task to someone or parent task
* Params:
  * `target`: target task's id or person's id
  * `type`: assign to target `task` or target `person`
  * `sort`: sort
* Return:

### `DELETE` /task/:id/assign
delete assign the task to someone or parent task
* Params:
  * `target`: target task's id
  * `type`: assign to target `task` or target `person`
* Return:

### `GET` /task/:id/tag
Get tags of the task
* Params:
* Return:
  * `tasks`: Array of `tag`

### `POST` /task/:id/tag
Get tags of the task
* Params:
  * `name`: tag name
* Return:

### `GET` /task/:id/sub
Get sub tasks of the task
* Params:
* Return:
  * `tasks`: Array of `simple_task`

### `GET` /task/:id/parent
Get parent tasks of the task
* Params:
* Return:
  * `tasks`: Array of `simple_task`

### `GET` /task/:id/comment
Get comments of the task
* Params:
  * Not finished.
* Return:
  * Not finished.

### `POST` /task/:id/comment
Post a new comment for the task.
* Params:
  * `task_id`: target task's id
  * `message`: comment message
* Return:
  * Not finished.

### `GET` /project/:id (Not finished)
Get project info
* Params:
* Return:
  * Not finished.

### `GET` /project/:id/task (Not finished)
Get tasks of the project(or task)
* Params:
* Return:
  * `tasks`: Array of `simple_task`

## 
## Search

### `POST` /search
* Params:
  * `word` : key word you want to search
  * `types`: Array of `type`, means which categorys you want to search
  * `organization_id` : ONLY ONE organization_id should be pass to search
  * (Not finished)
* Return:
  * `tasks`: Array of `simple_task`
  * `tags`: Array of `tag` (Not finished)

## Sample
### `GET` or `POST` /path/to/sample
URI Summary here. Method: `POST` or `GET` or else
* Params:
  * `p1`
  * `p2` with some note here.
* Return:
  * `key1`
  * `key2` with some note here.
