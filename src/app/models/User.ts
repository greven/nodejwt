import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Length, IsEmail, IsNotEmpty } from 'class-validator'
import argon2 from 'argon2'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Index()
  @Column('text', { unique: true })
  @IsEmail()
  email: string

  @Column('text')
  @Length(4, 100)
  password: string

  @Column('text')
  @IsNotEmpty()
  role: string

  @Column('date')
  @CreateDateColumn()
  createdAt: Date

  @Column('date')
  @UpdateDateColumn()
  updatedAt: Date

  async hashPassword() {
    this.password = await argon2.hash(this.password)
  }

  async checkPassword(unencryptedPassword: string) {
    return await argon2.verify(this.password, unencryptedPassword)
  }
}
