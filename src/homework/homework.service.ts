import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IResponse } from 'src/utils/response';
import { Homework } from 'src/entities/homework.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Record } from 'src/entities/recordTransmission.entity';
import * as fs from 'fs';
import { CourseService } from 'src/course/course.service';
import { Course } from 'src/entities/course.entity';


@Injectable()
export class HomeworkService {
    private response: IResponse;
    constructor(
        private courseService: CourseService,// 注入 CourseService
        @InjectRepository(Homework)
        private homeworkRepository: Repository<Homework>,
    ) { }

    public async addHomework(homework) {
        return await this.homeworkRepository
            .findOne({ where: { homework_name: homework.homework_name } })
            .then(res => {
                if (res != null) {
                    this.response = {
                        code: 1,
                        msg: "当前作业已存在"
                    }
                    throw this.response
                }
            })
            .then(async () => {
                try {
                    const courseId: number = homework.course
                    let course: Course = await this.courseService.findCourseById(courseId)
                    let parentPath = course.address
                    let packageName = homework.homework_name
                    const folderPath = `${parentPath}/${packageName}`
                    // 检查文件夹是否已经存在
                    if (!fs.existsSync(folderPath)) {
                        // 如果不存在，创建文件夹
                        fs.mkdirSync(folderPath);
                    }
                    homework.course = course
                    homework.address = folderPath
                    homework.DDL = new Date(homework.DDL)
                    await this.homeworkRepository.save(homework)
                    this.response = {
                        code: 0,
                        msg: "创建成功"
                    }
                    return this.response
                } catch (error) {
                    this.response = {
                        code: 2,
                        msg: "创建失败。错误详情: " + error
                    }
                    throw this.response;
                }
            })
            .catch(err => {
                console.warn(`发生问题——`, err);
                return err
            })
    }

    public async editHomework(homework: Homework) {
        return await this.homeworkRepository
            .createQueryBuilder("Homework")
            .where("Homework.id = :id", { id: homework.id })
            .getOne()
            .then(async (res: Homework) => {
                return await this.homeworkRepository
                    .createQueryBuilder("Homework")
                    .where("Homework.id = :id", { id: homework.id })
                    .update(Homework)
                    .set(homework)
                    .execute()
                    .then(() => {
                        return this.response = {
                            code: 0,
                            msg: "作业信息修改成功",
                        }
                    })
            })
    }

    public async delHomework(id: number) {
        return await this.homeworkRepository.createQueryBuilder('Homework')
            .delete()
            .from(Homework)
            .where("id = :id", { id: id })
            .execute()
            .then(() => {
                return this.response = {
                    code: 0,
                    msg: "作业删除成功",
                }
            })
    }

    public async getHomework(msg: any) {
        const query: string = msg.query
        const pagenum: number = msg.pagenum
        const pagesize: number = msg.pagesize
        let allOfHomework: Homework[]
        let thelist = []
        let total

        if (query == "") {
            allOfHomework = await this.homeworkRepository
                .createQueryBuilder("Homework")
                .getMany();
        } else {
            allOfHomework = await this.homeworkRepository
                .createQueryBuilder("Homework")
                .where("courseId = :courseId", { courseId: query })
                .orWhere("homework_name = :homework_name", { homework_name: query })
                .getMany();

        }
        total = allOfHomework.length
        let startNumber: number = (pagenum - 1) * pagesize
        let endNumber: number = pagenum * pagesize < total ? pagenum * pagesize : total
        for (let i = startNumber; i < endNumber; i++) {
            thelist.push(allOfHomework[i])
        }
        return this.response = {
            code: 0,
            msg: {
                data: thelist,
                total: total
            }
        }
    }

    //查看作业提交情况(待完成)
    public async countHomework(id: number) {
        let spendNum: number
        let notSpend: User[]
        let restudyNum: number

        let spendRecords = await this.homeworkRepository
            .createQueryBuilder('Homework')
            .where({ id: id })
            .select('records')
            .getMany()

        console.log(spendRecords)

        spendNum = spendRecords.length




    }

    public async getDDL(id: number) {
        let homework = await this.homeworkRepository.createQueryBuilder('Homework')
            .select('DDL')
            .where({ id: id })
            .getOne()
        return homework.DDL
    }

    public async getAddress(id: number) {
        let homework = await this.homeworkRepository.createQueryBuilder('Homework')
            .select('address')
            .where({ id: id })
            .getOne()
        return homework.address
    }

    public async findHomeworkById(id: number) {
        return await this.homeworkRepository.findOne({ where: { id: id } })
    }

    public async needPDF(id: number) {
        let homework = await this.homeworkRepository.createQueryBuilder('Homework')
            .select('need_PDF')
            .where({ id: id })
            .getOne()
        return homework.need_PDF
    }

    public async addCount(id: number, restudy: boolean) {
        if (restudy) {
            return await this.homeworkRepository
                .findOne({ where: { id: id } })
                .then(async (homework: Homework) => {
                    homework.total += 1;
                    homework.submit_Number += 1;
                    await this.homeworkRepository
                        .createQueryBuilder("Homework")
                        .where("Homework.id = :id", { id: id })
                        .update(Homework)
                        .set(homework)
                        .execute()
                        .then(() => {
                            return this.response = {
                                code: 0,
                                msg: "作业信息修改成功",
                            }
                        })
                })
        } else {
            return await this.homeworkRepository
                .findOne({ where: { id: id } })
                .then(async (homework: Homework) => {
                    homework.submit_Number += 1;
                    await this.homeworkRepository
                        .createQueryBuilder("Homework")
                        .where("Homework.id = :id", { id: id })
                        .update(Homework)
                        .set(homework)
                        .execute()
                        .then(() => {
                            return this.response = {
                                code: 0,
                                msg: "作业信息修改成功",
                            }
                        })
                })
        }
    }
}
