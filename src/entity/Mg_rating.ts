import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
export class Mg_rating {
  @PrimaryGeneratedColumn()
  rating_id: number;

  @Column()
  @IsNotEmpty()
  @Length(1, 100)
  redeem_id: number;

  @Column()
  @IsNotEmpty()
  @Length(1, 100)
  user_id: number;

  @Column()
  @IsNotEmpty()
  @Length(1, 255)
  rating_desc: string;

  @Column()
  @Length(1, 100)
  rating_value: number;

  @Column()
  @CreateDateColumn()
  rating_register: Date;

  @Column()
  @UpdateDateColumn()
  rating_updated: Date;
}
