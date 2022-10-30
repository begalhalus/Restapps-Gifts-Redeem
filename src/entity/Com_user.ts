import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
export class Com_user {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  @Length(2, 20)
  user_name: string;

  @Column()
  @Length(4, 30)
  user_email: string;

  @Column()
  @Length(4, 16)
  user_username: string;

  @Column()
  @Length(4, 100)
  user_password!: string;

  @Column()
  @CreateDateColumn()
  user_register: Date;

  @Column()
  @UpdateDateColumn()
  user_updated: Date;
}
