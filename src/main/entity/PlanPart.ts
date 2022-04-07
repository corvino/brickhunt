import { cp } from "fs";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import * as e from ".";

@Entity()
export class PlanPart extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountedFor: number

  @Column()
  exactColor: boolean

  @ManyToOne(() => e.Plan, null, { eager: true })
  plan: e.Plan;

  @ManyToOne(() => e.Build, null, { eager: true })
  partColor: e.PartColor;
}
