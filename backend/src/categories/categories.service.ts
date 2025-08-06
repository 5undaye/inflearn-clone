import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CategoriesService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManger: Cache,
    ) {}

    async findAll() {
        const cacheKey = 'categories:all';

        const cachedCategories = await this.cacheManger.get(cacheKey);

        if (cachedCategories) {
            console.log('캐시에서 조회');
            return cachedCategories;
        }

        const categories = this.prisma.courseCategory.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        });

        await this.cacheManger.set(cacheKey, categories);
        return categories;
    }

    async invalidateCache() {
        await this.cacheManger.del('categories:all');
    }
}
