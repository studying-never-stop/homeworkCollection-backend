import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Homework } from './homework.entity';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    coursename: string;

    @Column()
    teacher: string;

    @Column()
    grade: string;

    @Column()
    address: string;

    @OneToMany(() => Homework, homework => homework.course) // 一对多关系
    @JoinColumn({ name: 'courseId' }) // 指定外键列名
    homeworks: Homework[];
}