import {MigrationInterface, QueryRunner} from "typeorm";

const timestamp = new Date().getTime();

export class initialState implements MigrationInterface {
    name = `initialState${timestamp}`

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE IF NOT EXISTS expense (id varchar(36) not null constraint expense_pk primary key,value  numeric(3, 2), title  varchar(255), date timestamp, status integer )");
        await queryRunner.query("CREATE TABLE IF NOT EXISTS todo (id varchar(36) not null constraint todo_pk primary key, title varchar(255), message varchar(255), date timestamp, created timestamp, status integer)");
        await queryRunner.query("CREATE TABLE IF NOT EXISTS weight (id varchar(36) not null constraint weight_pk primary key, value numeric(3, 2), date timestamp)");
        await queryRunner.query("CREATE TABLE IF NOT EXISTS users (id varchar(36) not null constraint user_pk primary key, username varchar(255), password varchar(255))");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP DATABSE expense");
        await queryRunner.query("DROP DATABSE todo");
        await queryRunner.query("DROP DATABSE weight");
    }

}