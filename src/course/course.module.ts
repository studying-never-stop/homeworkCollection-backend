import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Course } from 'src/entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworkModule } from 'src/homework/homework.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CourseController],
  providers: [CourseService]
})
export class CourseModule { }
