import { Entity, PrimaryGeneratedColumn, OneToOne, Column, BaseEntity, ManyToOne, OneToMany} from "typeorm";
import * as e from ".";

@Entity()
export class BuildItem extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => e.PartColor)
  partColor: e.PartColor

  @ManyToOne(() => e.Build, b => b.items)
  build: e.Build;
}
