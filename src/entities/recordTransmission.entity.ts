import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Homework } from './homework.entity';

@Entity()
export class Record {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column({ type: 'datetime' })
    transferTime: Date;

    @ManyToOne(() => User, user => user.records)
    user: User;

    @ManyToOne(() => Homework, homework => homework.records)
    homework: Homework;
}