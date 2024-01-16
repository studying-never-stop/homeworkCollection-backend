import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import { Course } from './course.entity';
import { Record } from './recordTransmission.entity';

@Entity()
export class Homework {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    homework_name: string;

    @Column()
    address: string;

    @Column({ type: 'datetime' })
    DDL: Date;

    @Column()
    need_PDF: boolean;

    @Column({ default: 0 })
    submit_Number: number;

    @Column({ default: 37 })
    total: number;

    @ManyToOne(() => Course, course => course.homeworks) // 多对一关系
    @JoinColumn({ name: 'courseId' }) // 指定外键列名
    course: Course;

    @ManyToMany(() => Record, record => record.homework)
    @JoinTable()
    records: Record[];
}