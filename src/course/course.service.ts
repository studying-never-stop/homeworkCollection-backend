import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Course } from 'src/entities/course.entity';
import { IResponse } from 'src/utils/response';
import { InjectRepository } from '@nestjs/typeorm';
import { DateService } from 'src/date/date.service';
import * as fs from 'fs';

@Injectable()
export class CourseService {

    private response: IResponse;
    private dateService: DateService
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
    ) { }

    public async addCourse(course: Course) {
        return await this.courseRepository.find({ where: { coursename: course.coursename } })
            .then(res => {
                if (res != null) {
                    this.response = {
                        code: 1,
                        msg: "当前课程已存在"
                    }
                    throw this.response
                }
            })
            .then(async () => {
                try {
                    await this.courseRepository.save(course)
                    let packageName = course.coursename
                    const parentPath = 'D:' + `${course.grade}`
                    const folderPath = parentPath + `${packageName}`
                    if (!fs.existsSync(parentPath)) {
                        fs.mkdirSync(parentPath);
                    }
                    // 检查文件夹是否已经存在
                    if (!fs.existsSync(folderPath)) {
                        // 如果不存在，创建文件夹
                        fs.mkdirSync(folderPath);
                    }
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

    public async editCourse(course: Course) {
        return await this.courseRepository
            .createQueryBuilder("Course")
            .where("Course.id = :id", { id: course.id })
            .update(Course)
            .set(course)
            .execute()
            .then(() => {
                return this.response = {
                    code: 0,
                    msg: "课程信息修改成功",
                }
            })
    }

    public async delCourse(id: number) {
        return await this.courseRepository.createQueryBuilder('Course')
            .delete()
            .from(Course)
            .where("id = :id", { id: id })
            .execute()
            .then(() => {
                return this.response = {
                    code: 0,
                    msg: "课程删除成功",
                }
            })
    }

    public async getCourse(msg: any) {
        const query: string = msg.query
        const pagenum: number = msg.pagenum
        const pagesize: number = msg.pagesize
        let thelist = []
        let total

        if (query == '') {
            let allOfCourse = await this.courseRepository
                .createQueryBuilder("Course")
                .getMany();

            total = allOfCourse.length
            let startNumber: number = (pagenum - 1) * pagesize
            let endNumber: number = pagenum * pagesize < total ? pagenum * pagesize : total
            for (let i = startNumber; i < endNumber; i++) {
                thelist.push(allOfCourse[i])
            }
        }
        else {
            let findUser = await this.courseRepository.createQueryBuilder("User")
                .where("User.realname = :realname", { coursename: query })
                .orWhere("User.student_number = :student_number", { teacher: query })
                .getOne();

            thelist.push(findUser)
            total = 1;
        }
        return this.response = {
            code: 0,
            msg: {
                data: thelist,
                total: total
            }
        }
    }

    public async getCourseHomework() {
        const homeworktable = await this.courseRepository.createQueryBuilder('Course')
            .select('coursename')
            .addSelect('homeworks')
            .getMany()

        return this.response = {
            code: 0,
            msg: {
                data: homeworktable
            }
        }

    }

}
