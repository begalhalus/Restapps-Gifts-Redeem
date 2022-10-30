import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
export class Com_user_reedem {
  @PrimaryGeneratedColumn()
  redeem_id: number;

  @Column()
  @IsNotEmpty()
  user_id: number;

  @Column()
  @Length(1, 100)
  prod_id: number;

  @Column({
    nullable: true,
  })
  @Length(1, 100)
  qty: number;

  @Column()
  @CreateDateColumn()
  reedem_register: Date;

  @Column()
  @UpdateDateColumn()
  reedem_updated: Date;
}
