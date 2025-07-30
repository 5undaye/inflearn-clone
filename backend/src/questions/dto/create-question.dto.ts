import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
    @ApiProperty({
        description: '질문 제목',
        example: '강의한 설명한 부분에 대한 질문입니다.',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: '질문 내용',
        example: '5분 10초에서 설명한 내용이 이해가 되지 않아요.',
    })
    @IsString()
    @IsNotEmpty()
    content: string;
}
