import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class FileTypeGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const allowedMimeTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const request = context.switchToHttp().getRequest();
        const file = request.file;

        if (file && file.mimetype && allowedMimeTypes.includes(file.mimetype)) {
            return true;
        }

        return false;
    }
}
