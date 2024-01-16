import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { Homework } from 'src/entities/homework.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { Role } from 'src/utils/role';

@Controller('homework')
@UseGuards(AuthGuard)
export class HomeworkController {
    constructor(
        private homeworkService: HomeworkService
    ) { }

    @Post('addHomework')
    @Role('管理员')
    public async addHomework(@Body() homework) {
        return await this.homeworkService.addHomework(homework)
    }

    @Post('editHomework')
    @Role('管理员')
    public async editHomework(@Body() homework: Homework) {
        return await this.homeworkService.editHomework(homework)
    }

    @Post('delHomework')
    @Role('管理员')
    public async delHomework(@Body() id: number) {
        return await this.homeworkService.delHomework(id)
    }

    @Post('getHomework')
    @Role('管理员')
    public async getHomework(@Body() msg: any) {
        return await this.homeworkService.getHomework(msg)
    }

    @Post('countHomework')
    public async countHomework(@Body() id: number) {
        return await this.homeworkService.countHomework(id)
    }
}
