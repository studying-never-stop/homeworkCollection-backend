import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { Course } from 'src/entities/course.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { Role } from 'src/utils/role';

@Controller('course')
@UseGuards(AuthGuard)
export class CourseController {
    constructor(
        private courseService: CourseService
    ) { }

    @Post('addCourse')
    @Role('管理员')
    public async addCourse(@Body() course: Course) {
        return await this.courseService.addCourse(course)
    }

    @Post('editCourse')
    @Role('管理员')
    public async editCourse(@Body() course: Course) {
        return await this.courseService.editCourse(course)
    }

    @Post('delCourse')
    @Role('管理员')
    public async delCourse(@Body() id: number) {
        return await this.courseService.delCourse(id)
    }

    @Post('getCourse')
    @Role('管理员')
    public async getCourse(@Body() msg: any) {
        return await this.courseService.getCourse(msg)
    }

    @Post('getCourseHomework')
    public async CourseHomework() {
        return await this.courseService.getCourseHomework()
    }
}
