import { BaseEntity, Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import * as entities from ".";

@Entity()
export class Color extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  legoId: number;

  @Column({nullable: true})
  bricklinkId: number;

  @ManyToOne(() => entities.ColorFamily, cf => cf.colors)
  family: entities.ColorFamily;

  @OneToMany(() => entities.PartColor, pc => pc.color)
  partColors: entities.PartColor[]
}
