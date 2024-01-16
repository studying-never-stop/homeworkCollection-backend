import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
    getCurrentDateTime(): string {
        const currentDateTime = new Date();
        return this.toMysqlFormat(currentDateTime);
    }

    private toMysqlFormat(date: Date): string {
        const year = date.getFullYear();
        const month = this.padZero(date.getMonth() + 1);
        const day = this.padZero(date.getDate());
        const hours = this.padZero(date.getHours());
        const minutes = this.padZero(date.getMinutes());
        const seconds = this.padZero(date.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    private padZero(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }
}

