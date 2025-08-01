import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {
    @ApiProperty({
        description: '수강평 내용',
        example: '정말 유익한 강의였습니다.',
        required: false,
    })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiProperty({
        description: '평점 (1 ~ 5)',
        example: 5,
        required: false,
    })
    @IsInt()
    @Min(0)
    @Max(5)
    @IsOptional()
    rating?: number;
}
