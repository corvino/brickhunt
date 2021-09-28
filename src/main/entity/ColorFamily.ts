import { Entity, PrimaryGeneratedColumn, OneToMany, Column, BaseEntity} from "typeorm";
import * as entities from ".";

@Entity()
export class ColorFamily extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => entities.Color, c => c.family)
  colors: entities.Color[];
}
