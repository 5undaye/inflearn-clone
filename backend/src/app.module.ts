import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { LecturesModule } from './lectures/lectures.module';
import { SectionsModule } from './sections/sections.module';
import { CategoriesModule } from './categories/categories.module';
import { MediaModule } from './media/media.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { QuestionsModule } from './questions/questions.module';
import { CartsModule } from './carts/carts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    CoursesModule,
    LecturesModule,
    SectionsModule,
    CategoriesModule,
    MediaModule,
    UsersModule,
    CommentsModule,
    QuestionsModule,
    CartsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
