import { Entity, PrimaryColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Build extends BaseEntity {

  // This is the fips code, which is the STATE column in the census state csv.
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;
}
