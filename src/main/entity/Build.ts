import { Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Build extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
