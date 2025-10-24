import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile]), PostsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
