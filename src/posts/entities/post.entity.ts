import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({
    length: 255,
    type: 'varchar',
    name: 'cover_image_url',
    nullable: true,
  })
  coverImageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  summary: string;

  @Column({ default: true, type: 'boolean', name: 'is_draft' })
  isDraft: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
