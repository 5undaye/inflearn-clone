import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import slugify from 'lib/slugify';

import { CreateCourseDto } from './dto/create-course-dto';
import { UpdateCourseDto } from './dto/update-course-dto';
import { SearchCourseDto } from './dto/search-course-dto';
import { SearchCourseResponseDto } from './dto/search-response-dto';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, createCourseDto: CreateCourseDto): Promise<Course> {
        return this.prisma.course.create({
            data: {
                title: createCourseDto.title,
                slug: slugify(createCourseDto.title),
                status: 'DRAFT',
                instructorId: userId,
            },
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.CourseWhereUniqueInput;
        where?: Prisma.CourseWhereInput;
        orderBy?: Prisma.CourseOrderByWithRelationInput;
    }): Promise<Course[]> {
        const { skip, take, cursor, where, orderBy } = params;

        return this.prisma.course.findMany({ skip, take, cursor, where, orderBy });
    }

    async findOne(id: string, include?: Prisma.CourseInclude): Promise<Course | null> {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include,
        });

        return course;
    }

    async update(id: string, userId: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
        const course = await this.prisma.course.findUnique({ where: { id } });

        if (!course) {
            throw new NotFoundException(`ID: ${id} 코스를 찾을 수 없습니다.`);
        }

        const { categoryIds, ...rest } = updateCourseDto;
        const data: Prisma.CourseUpdateInput = { ...rest };

        if (course.instructorId !== userId) {
            throw new UnauthorizedException('강의의 소유자만 수정할 수 있습니다.');
        }

        if (categoryIds && categoryIds.length > 0) {
            data.categories = {
                connect: categoryIds.map((id) => ({ id })),
            };
        }

        return this.prisma.course.update({
            where: { id },
            data,
        });
    }

    async delete(id: string, userId: string) {
        const course = await this.prisma.course.findUnique({ where: { id } });

        if (!course) {
            throw new NotFoundException(`ID: ${id} 코스를 찾을 수 없습니다.`);
        }

        if (course.instructorId !== userId) {
            throw new UnauthorizedException('강의의 소유자만 삭제할 수 있습니다.');
        }

        await this.prisma.course.delete({
            where: { id },
        });

        return course;
    }

    // 새로 추가된 메서드
    async searchCourses(searchCourseDto: SearchCourseDto): Promise<SearchCourseResponseDto> {
        const { q, category, priceRange, sortBy, order, page, pageSize } = searchCourseDto;

        const where: Prisma.CourseWhereInput = {};

        // 키워드 검색 (강의명, 강사명에서 부분 일치)
        if (q) {
            where.OR = [
                {
                    title: {
                        contains: q,
                        mode: 'insensitive',
                    },
                },
                {
                    instructor: {
                        name: {
                            contains: q,
                            mode: 'insensitive',
                        },
                    },
                },
            ];
        }

        // 카테고리 필터
        if (category) {
            where.categories = {
                some: {
                    slug: category,
                },
            };
        }

        // 가격 범위 필터
        if (priceRange) {
            const priceConditions: any = {};
            if (priceRange.min !== undefined) {
                priceConditions.gte = priceRange.min;
            }
            if (priceRange.max !== undefined) {
                priceConditions.lte = priceRange.max;
            }
            if (Object.keys(priceConditions).length > 0) {
                where.price = priceConditions;
            }
        }

        // 정렬 조건
        const orderBy: Prisma.CourseOrderByWithRelationInput = {};
        if (sortBy === 'price') {
            orderBy.price = order as 'asc' | 'desc';
        }

        // 페이지네이션 계산
        const skip = (page - 1) * pageSize;
        const totalItems = await this.prisma.course.count({ where });

        // 강의 목록 조회
        const courses = await this.prisma.course.findMany({
            where,
            orderBy,
            skip,
            take: pageSize,
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                categories: true,
                _count: {
                    select: {
                        enrollments: true,
                        reviews: true,
                    },
                },
            },
        });

        // 페이지네이션 정보 계산
        const totalPages = Math.ceil(totalItems / pageSize);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
            courses: courses as any[],
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNext,
                hasPrev,
            },
        };
    }
}
