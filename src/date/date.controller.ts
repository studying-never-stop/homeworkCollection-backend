import { Controller, Get } from '@nestjs/common';
import { DateService } from './date.service';

@Controller('date')
export class DateController {
    constructor(private readonly dateService: DateService) { }

    @Get('current')
    getCurrentDateTime(): { currentDateTime: string } {
        const currentDateTime = this.dateService.getCurrentDateTime();
        return { currentDateTime };
    }
}
