import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Record } from './recordTransmission.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  realname: string;

  @Column()
  student_number: string;

  @Column({ default: "123456" })
  password: string;

  @Column({
    type: "enum",
    enum: ["管理员", "本班学生", "重修学生"],
    default: "本班学生"
  })
  role: string;

  @ManyToMany(() => Record, record => record.user)
  @JoinTable()
  records: Record[];
}