# db changelog


## 2015-03-01: Change tag name type
ALTER TABLE `tag` CHANGE `name` `name` VARCHAR(50)  NULL  DEFAULT NULL;
ALTER TABLE `tag` CHANGE `project_id` `organization_id` INT(11)  NULL  DEFAULT NULL;
ALTER TABLE `tag` DROP INDEX `name_project_id`;
ALTER TABLE `tag` ADD INDEX `organization_id_name` (`organization_id`, `name`);
ALTER TABLE `tag` ADD `updatetime` INT  NULL  DEFAULT NULL  AFTER `task_id`;
ALTER TABLE `tag` ADD `createtime` INT  NULL  DEFAULT NULL  AFTER `task_id`;

