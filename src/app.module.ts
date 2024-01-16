import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CourseService } from './course/course.service';
import { CourseModule } from './course/course.module';
import { HomeworkController } from './homework/homework.controller';
import { HomeworkModule } from './homework/homework.module';
import { DateModule } from './date/date.module';
import { FileTransportModule } from './file-transport/file-transport.module';
import * as ormconfig from '../ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    CourseModule,
    HomeworkModule,
    DateModule,
    FileTransportModule, // 导入 TypeOrmModule 并配置连接
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
