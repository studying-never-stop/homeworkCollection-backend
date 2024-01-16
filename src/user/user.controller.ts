import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { Role } from 'src/utils/role';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post('login')
    async login(@Body() user) {
        return await this.userService.login(user)
    }

    @Post('adduser')
    // @Role('管理员')
    async adduser(@Body() user: User) {
        return await this.userService.adduser(user)
    }

    @Post('edituser')
    async edituser(@Body() user: User) {
        return await this.userService.edituser(user)
    }

    @Post('deluser')
    @Role('管理员')
    async deluser(@Body() id: number) {
        return await this.userService.deluser(id)
    }

    @Post('getuser')
    @Role('管理员')
    async getuser(@Body() msg: any) {
        return await this.userService.getUsers(msg)
    }

    //to load all users from excel(to do)
    @Post('addusers')
    async addusers() { }

}
