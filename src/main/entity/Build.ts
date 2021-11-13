import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne} from "typeorm";
import * as e from ".";

@Entity()
export class Build extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => e.BuildItem, b => b.build, { cascade: true})
  items: e.BuildItem[]

  @ManyToOne(() => e.Plan, p => p.builds)
  plans: e.Plan[]
}
