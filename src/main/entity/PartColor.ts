import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import * as entities from ".";

@Entity()
export class PartColor extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imgURL: string;

  @Column()
  elementId: number;

  @ManyToOne(() => entities.Color, c => c.partColors, { eager: true, cascade: true })
  color: entities.Color;

  @ManyToOne(() => entities.Part, p => p.partColors)
  part: entities.Part;
}
