import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import * as e from ".";

@Entity()
export class Plan extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => e.Build)
  @JoinTable()
  builds: e.Build[]
}
