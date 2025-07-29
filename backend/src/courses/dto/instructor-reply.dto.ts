import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InstructorReplyDto {
    @ApiProperty({ description: '강사 답변', example: '좋은 답변 감사합니다!' })
    @IsString()
    @IsNotEmpty()
    instructorReply: string;
}
