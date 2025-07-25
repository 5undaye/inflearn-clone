import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from '@nestjs/class-transformer';

export class PriceRangeDto {
    @ApiProperty({
        description: '최소 가격',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    min?: number;

    @ApiProperty({
        description: '최대 가격',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    max?: number;
}

export class SearchCourseDto {
    @ApiProperty({ description: '검색 키워드', required: false })
    @IsOptional()
    @IsString()
    q?: string;

    @ApiProperty({ description: '카테고리 ID', required: false })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({ description: '가격 범위', required: false })
    @IsOptional()
    @Type(() => PriceRangeDto)
    priceRange?: PriceRangeDto;

    @ApiProperty({ description: '정렬 기준', required: false, enum: ['price'] })
    @IsOptional()
    @IsString()
    @IsIn(['price'])
    sortBy?: string = 'price';

    @ApiProperty({ description: '정렬 순서', required: false, enum: ['asc', 'desc'] })
    @IsOptional()
    @IsString()
    @IsIn(['asc', 'desc'])
    order?: string = 'asc';

    @ApiProperty({ description: '페이지 번호', required: false, default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @ApiProperty({ description: '페이지 당 정렬 수', required: false, default: 20, maximum: 100 })
    @IsOptional()
    @IsNumber()
    @Min(20)
    @Max(100)
    @Type(() => Number)
    pageSize?: number = 20;
}
