import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Homework } from 'src/entities/homework.entity';
import { CourseModule } from 'src/course/course.module';
import { FileTransportModule } from 'src/file-transport/file-transport.module';
import { CourseService } from 'src/course/course.service';

@Module({
  imports: [TypeOrmModule.forFeature([Homework]), CourseModule],
  controllers: [HomeworkController],
  providers: [HomeworkService],
  exports: [HomeworkService]
})
export class HomeworkModule { }
