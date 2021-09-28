import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as entities from ".";

@Entity()
export class Part extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  designId: number;

  @Column()
  name: string;

  @Column({nullable: true})
  bricklinkId: number;

  @Column()
  price: number;

  @OneToMany(() => entities.PartColor, pc => pc.part, { eager: true, cascade: true })
  partColors: entities.PartColor[];
}
