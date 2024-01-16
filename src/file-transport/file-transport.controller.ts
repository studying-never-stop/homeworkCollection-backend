import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileTransportService } from './file-transport.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('file-transport')
export class FileTransportController {
    constructor(
        private recordService: FileTransportService
    ) { }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    private async uploadFiles(@UploadedFiles() files, @Body() msg) {
        return this.recordService.upload(files, msg)
    }
}
