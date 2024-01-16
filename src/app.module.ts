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
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'wsy021031',
      database: 'homeworkCollectionSystem',
      charset: 'utf8mb4',
      synchronize: true, // 设置为 true 将在每次应用程序启动时自动创建数据库表（仅用于开发环境）
      // logging: true, // 设置为 true 将启用 SQL 查询日志
      // entities: ['src/entities/*.entity.ts'], // 根据你的项目结构配置实体类的路径
      entities: [join(__dirname, '**', '*.entity.{ts,js}')]
    }),
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
