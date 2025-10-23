import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 255, type: 'varchar', name: 'cover_image_url' })
  coverImageUrl: string;

  @Column({ type: 'varchar', length: 255 })
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
}
