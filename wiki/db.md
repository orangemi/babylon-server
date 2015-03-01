# Babylon

## heart
* Columns:
  * `id` : int(11) NOT NULL AUTO_INCREMENT
  * `person_id` : int(11) DEFAULT NULL
  * `task_id` : int(11) DEFAULT NULL
  * `extra` : text

* Primary Key : `id`
* Index:
  * `person_id` : `person_id`
  * `task_id` : `task_id`


## history
* Columns:
  * `id` : int(11) NOT NULL AUTO_INCREMENT
  * `task_id` : int(11) DEFAULT NULL
  * `type` : int(11) DEFAULT NULL
  * `status` : int(11) DEFAULT NULL
  * `content` : text
  * `creator` : int(11) DEFAULT NULL
  * `extra` : text
  * `createtime` : int(11) DEFAULT NULL
  * `updatetime` : int(11) DEFAULT NULL
  
* Primary Key : `id`
* Index:
  * `task_id` : `task_id`


## organization
* Columns:
  * `id` : int(11) NOT NULL AUTO_INCREMENT
  * `name` : varchar(500) DEFAULT NULL
  * `description` : text
  * `status` : int(11) DEFAULT NULL
  * `extra` : text
  * `owner` : int(11) DEFAULT NULL
  * `createtime` : int(11) DEFAULT NULL
  * `updatetime` : int(11) DEFAULT NULL
  
* Primary Key : `id`
* Index:


## person
* Columns:
  * `id` : int(11) NOT NULL AUTO_INCREMENT
  * `status` : int(11) DEFAULT NULL
  * `email` : varchar(100) DEFAULT NULL
  * `name` : varchar(100) DEFAULT NULL
  * `password` : varchar(100) DEFAULT NULL
  * `description` : text
  * `createtime` : int(11) DEFAULT NULL
  * `updatetime` : int(11) DEFAULT NULL
  * `extra` : text
  
* Primary Key : `id`
* Index:
  * `email` : `email`


## person2organization
* Columns:
  * `id` : int(11) NOT NULL AUTO_INCREMENT
  * `person_id` : int(11) DEFAULT NULL
  * `organization_id` : int(11) DEFAULT NULL
  * `sort` : int(11) DEFAULT NULL
  * `extra` : text
  
* Primary Key : `id`
* Index:
  * `person_id` : `person_id`
  * `organization_id` : `organization_id`


## person2task
* Columns:
  * `id` : int(11) NOT NULL AUTO_INCREMENT
  * `person_id` : int(11) DEFAULT NULL
  * `task_id` : int(11) DEFAULT NULL
  * `sort` : int(11) DEFAULT NULL
  * `extra` : text
  
* Primary Key : `id`
* Index:
  * `person_id` : `person_id`
  * `task_id` : `task_id`


## tag
* Columns:
  * `id` : int(11) NOT NULL AUTO_INCREMENT
  * `status` : int(11) NOT NULL AUTO_INCREMENT
  * `name` : varchar(50) DEFAULT NULL
  * `organization_id` : int(11) DEFAULT NULL
  * `task_id` : int(11) DEFAULT NULL
  * `createtime` : int(11) DEFAULT NULL
  * `updatetime` : int(11) DEFAULT NULL
  * `extra` : text
  
* Primary Key : `id`
* Index:
  * `organization_id` : `organization_id`
  * `organization_id_name` : `organization_id`,`name`
  * `task_id` : `task_id`


## task
* Columns:
  * `id` : int(11) NOT NULL AUTO_INCREMENT
  * `organization_id` : int(11) NOT NULL DEFAULT '0'
  * `type` : int(11) DEFAULT NULL
  * `status` : int(11) DEFAULT NULL
  * `title` : varchar(500) DEFAULT NULL
  * `description` : text
  * `complete` : int(11) DEFAULT NULL
  * `creator` : int(11) DEFAULT NULL
  * `assign` : int(11) DEFAULT NULL
  * `scheduletime` : int(11) DEFAULT NULL
  * `createtime` : int(11) DEFAULT NULL
  * `updatetime` : int(11) DEFAULT NULL
  * `extra` : text
  
* Primary Key : `id`
* Index:


## task2task
* Columns:
  * `id` : int(11) NOT NULL AUTO_INCREMENT
  * `task_id` : int(11) DEFAULT NULL
  * `parent_id` : int(11) DEFAULT NULL
  * `sort` : int(11) DEFAULT NULL
  * `extra` : text
  
* Primary Key : `id`
* Index:
  * `task_id` : `task_id`
  * `parent_id` : `parent_id`

