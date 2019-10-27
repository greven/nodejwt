import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn
} from "typeorm"

@Entity('author')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  @Index({ unique: true })
  email: string

  @Column()
  password: string

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }
}
