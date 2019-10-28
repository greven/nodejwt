import {
  Entity,
  Column,
  Index,
  Unique,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Length, IsEmail, IsNotEmpty } from 'class-validator'
import argon2 from 'argon2'

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index()
  @IsEmail()
  email: string

  @Column()
  @Length(4, 100)
  password: string

  @Column()
  @IsNotEmpty()
  role: string

  @Column()
  @CreateDateColumn()
  createdAt: Date

  @Column()
  @UpdateDateColumn()
  updatedAt: Date

  async hashPassword() {
    this.password = await argon2.hash(this.password)
  }

  async checkPassword(unencryptedPassword: string) {
    return await argon2.verify(this.password, unencryptedPassword)
  }
}
