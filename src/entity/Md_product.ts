import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
export class Md_product {
  @PrimaryGeneratedColumn()
  prod_id: number;

  @Column()
  @IsNotEmpty()
  @Length(1, 100)
  prod_name: string;

  @Column()
  @IsNotEmpty()
  @Length(1, 255)
  prod_desc: string;

  @Column()
  @Length(1, 100)
  prod_amount: number;

  @Column()
  @Length(1, 100)
  prod_stock: number;

  @Column({
    nullable: true,
  })
  @Length(1, 100)
  prod_badge: string;

  @Column()
  @CreateDateColumn()
  prod_register: Date;

  @Column()
  @UpdateDateColumn()
  prod_updated: Date;
}
