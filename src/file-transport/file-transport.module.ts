import { Module } from '@nestjs/common';
import { FileTransportService } from './file-transport.service';
import { FileTransportController } from './file-transport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from 'src/entities/recordTransmission.entity';
import { UserModule } from 'src/user/user.module';
import { HomeworkModule } from 'src/homework/homework.module';

@Module({
  imports: [TypeOrmModule.forFeature([Record]), UserModule, HomeworkModule],
  providers: [FileTransportService],
  controllers: [FileTransportController]
})
export class FileTransportModule { }
