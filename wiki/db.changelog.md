# db changelog

## 2015-03-08: Change table name
```
RENAME TABLE `person` TO `user`;
RENAME TABLE `person2task` TO `user2task`;
RENAME TABLE `person2organization` TO `user2organization`;
ALTER TABLE `user2organization` ADD `position` VARCHAR(200)  NULL  DEFAULT NULL  AFTER `organization_id`;
ALTER TABLE `user2organization` CHANGE `person_id` `user_id` INT(11)  NULL  DEFAULT NULL;

```

## 2015-03-08: Change assign
```
ALTER TABLE `task` CHANGE `assign` `assign` INT(11)  NULL  DEFAULT '0';
ALTER TABLE `task` ADD `sort` INT  NULL  DEFAULT NULL  AFTER `assign`;
ALTER TABLE `task` ADD `tags` TEXT  NULL  AFTER `sort`;
-- DROP TABLE `person2task`;
```


## 2015-03-01: Change tag name type
```
ALTER TABLE `tag` CHANGE `name` `name` VARCHAR(50)  NULL  DEFAULT NULL;
ALTER TABLE `tag` CHANGE `project_id` `organization_id` INT(11)  NULL  DEFAULT NULL;
ALTER TABLE `tag` DROP INDEX `name_project_id`;
ALTER TABLE `tag` ADD INDEX `organization_id_name` (`organization_id`, `name`);
ALTER TABLE `tag` ADD `updatetime` INT  NULL  DEFAULT NULL  AFTER `task_id`;
ALTER TABLE `tag` ADD `createtime` INT  NULL  DEFAULT NULL  AFTER `task_id`;
```
