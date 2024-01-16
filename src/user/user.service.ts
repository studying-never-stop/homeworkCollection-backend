import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IResponse } from 'src/utils/response';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    private response: IResponse;
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    //后期需要修改适应更多情况
    public async getUsers(msg) {
        const query: string = msg.query
        const pagenum: number = msg.pagenum
        const pagesize: number = msg.pagesize
        let thelist = []
        let total
        let allOfUser: User[]

        if (query == '') {
            allOfUser = await this.userRepository
                .createQueryBuilder("User")
                .getMany();


        }
        else {
            allOfUser = await this.userRepository.createQueryBuilder("User")
                .where("User.realname = :realname", { realname: query })
                .orWhere("User.student_number = :student_number", { student_number: query })
                .getMany();

        }
        total = allOfUser.length
        let startNumber: number = (pagenum - 1) * pagesize
        let endNumber: number = pagenum * pagesize < total ? pagenum * pagesize : total
        for (let i = startNumber; i < endNumber; i++) {
            thelist.push(allOfUser[i])
        }
        return this.response = {
            code: 0,
            msg: {
                data: thelist,
                total: total
            }
        }
    }

    private async validate(user) {
        const username: string = user.username;
        const password: string = user.password;
        return await this.userRepository.findOne({ where: { student_number: username } })
            .then(res => {
                if (res == null) {
                    this.response = {
                        code: 3,
                        msg: "用户不存在"
                    }
                    throw this.response
                }
                return res
            })
            .then((dbuser: User) => {
                if (password == dbuser.password) {
                    return this.response = {
                        code: 0,
                        msg: {
                            username: dbuser.realname,
                            studentNumber: dbuser.student_number,
                            userRole: dbuser.role,
                        }
                    }
                } else if (password == "123456") {
                    return this.response = {
                        code: 1,
                        msg: {
                            username: dbuser.realname,
                            studentNumber: dbuser.student_number,
                            userRole: dbuser.role,
                        }
                    }
                } else {
                    this.response = {
                        code: 4,
                        msg: "用户名密码错误"
                    }
                    throw this.response;
                }
            })
            .catch(err => {
                return err
            })
    }

    public async login(user) {
        return await this.validate(user)
            .then(async (res: IResponse) => {
                if (res.code != 0 && res.code != 1) {
                    this.response = res;
                    throw this.response;
                }
                console.log(res.code)
                const username = res.msg.username
                const student_number = res.msg.student_number
                const role = res.msg.userRole
                if (res.code == 1) {
                    this.response = {
                        code: 0,
                        msg: {
                            needchange: true,
                            token: await this.createToken(user),
                            username,
                            student_number,
                            role
                        }
                    }
                } else {
                    this.response = {
                        code: 0,
                        msg: {
                            needchange: false,
                            token: await this.createToken(user),
                            username,
                            student_number,
                            role
                        }
                    }
                }
                return this.response
            })
            .catch(err => {
                console.log(err)
                return err
            })
    }

    public async adduser(user: User) {
        return this.userRepository.findOne({ where: { student_number: user.student_number } })
            .then(res => {
                console.log(res)
                if (res != null) {
                    this.response = {
                        code: 1,
                        msg: "当前学号已注册"
                    }
                    throw this.response
                }
            })
            .then(async () => {
                try {
                    await this.userRepository.save(user)
                    this.response = {
                        code: 0,
                        msg: "注册成功"
                    }
                    return this.response
                } catch (error) {
                    this.response = {
                        code: 2,
                        msg: "用户注册失败。错误详情: " + error
                    }
                    throw this.response;
                }
            })
            .catch(err => {
                console.warn(`发生问题——`, err);
                return err
            })
    }

    public async edituser(user: User) {
        return await this.userRepository
            .createQueryBuilder("User")
            .where("User.id = :id", { id: user.id })
            .getOne()
            .then(async (res: User) => {
                return await this.userRepository.createQueryBuilder('User')
                    .update(User)
                    .set(user)
                    .where("id = :id", { id: user.id })
                    .execute()
                    .then(() => {
                        return this.response = {
                            code: 0,
                            msg: "用户修改成功",
                        }
                    })
            })
    }

    public async deluser(id: number) {
        return await this.userRepository.createQueryBuilder('User')
            .delete()
            .from(User)
            .where("id = :id", { id: id })
            .execute()
            .then(() => {
                return this.response = {
                    code: 0,
                    msg: "用户删除成功",
                }
            })
    }

    private async createToken(user) {
        return await this.jwtService.sign(user)
    }

    public async findUserByStuNum(studentNumber: string) {
        return await this.userRepository.findOne({ where: { student_number: studentNumber } })
    }

    public async getUserType(studentNumber: string) {
        const role = (await this.userRepository.findOne({ where: { student_number: studentNumber } })).role
        if (role == '重修学生') {
            return true;
        } else {
            return false;
        }
    }
}
