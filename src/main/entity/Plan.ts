import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import * as e from ".";

@Entity()
export class Plan extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => e.Build, b => b.plans)
  builds: e.Build[]
}
