import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IResponse } from 'src/utils/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from 'src/entities/recordTransmission.entity';
import * as fs from 'fs';
import { DateService } from 'src/date/date.service';
import { HomeworkService } from 'src/homework/homework.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { Homework } from 'src/entities/homework.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class FileTransportService {
    private response: IResponse;
    private dateService: DateService;
    private homeworkService: HomeworkService;
    private userService: UserService
    private courseService: CourseService
    constructor(
        @InjectRepository(Record)
        private recordRepository: Repository<Record>,
    ) { }

    //是否需要从客户端下载
    public async downLoad() { }

    public async addRecord(msg, filename) {
        const homeworkId = msg.id
        const studentNumber = msg.studentNumber


        const homework: Homework = await this.homeworkService.findHomeworkById(homeworkId)
        const user: User = await this.userService.findUserByStuNum(studentNumber)

        let newRecord: Record

        newRecord.homework = homework
        newRecord.user = user
        newRecord.transferTime = new Date(this.dateService.getCurrentDateTime())
        newRecord.filename = filename

        await this.recordRepository.save(newRecord)
    }

    public async check(files, homeworkId: number) {
        const nowTime: Date = new Date()
        const DDL: Date = await this.homeworkService.getDDL(homeworkId)
        const PDF: boolean = await this.homeworkService.needPDF(homeworkId)
        if (nowTime > DDL) {
            return this.response = {
                code: 1,
                msg: "已超过截止时间，请自行联系老师提交作业！"
            }
        } else if (PDF) {
            //可扩充此功能配合作业类型可多选
            const allowedMimeTypes = ['application/pdf'];
            for (const file of files) {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return this.response = {
                        code: 2,
                        msg: "请将作业保存为PDF之后再提交"
                    }
                }
            }
        } else {
            const spendTime = this.dateService.getCurrentDateTime()
            return this.response = {
                code: 0,
                msg: true
            }
        }
    }

    public async upload(files, msg) {
        const homeworkId = msg.id
        const username = msg.username
        const studentNumber = msg.studentNumber
        const homeworkName = msg.homeworkName
        const address = await this.homeworkService.getAddress(homeworkId)
        const folderPath = address + `/${studentNumber}${username}${homeworkName}`

        return await this.check(files, homeworkId)
            .then(async (res: IResponse) => {
                if (res.code == 0) {
                    // 检查文件夹是否已经存在
                    if (!fs.existsSync(folderPath)) {
                        // 如果不存在，创建文件夹
                        fs.mkdirSync(folderPath);
                    }
                    for (const file of files) {
                        const originalname = file.originalname
                        const destinationPath = path.join(folderPath, originalname);

                        // 移动上传的文件到目标文件夹
                        fs.renameSync(file.path, destinationPath);
                        this.addRecord(msg, originalname)
                    }
                    this.response = {
                        code: 0,
                        msg: "上传成功"
                    }
                    const restudy = await this.userService.getUserType(studentNumber)
                    this.homeworkService.addCount(homeworkId, restudy)
                } else {
                    this.response = res;
                }
                return this.response
            })
    }

    public async homeworkTable() {

    }
}
