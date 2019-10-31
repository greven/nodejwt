import argon2 from 'argon2'
import { IsEmail, Length } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum RoleType {
  USER = 'user',
  EDITOR = 'editor',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

export interface UserInterface {
  id: string
  email: string
  password: string
  role: string
  tokenVersion: number
  createdAt: Date
  updatedAt: Date
}

@Entity()
export class User implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ type: 'text', unique: true })
  @IsEmail()
  email: string

  @Column('text')
  @Length(8, 100)
  password: string

  @Column({ type: 'text', default: RoleType.USER })
  role: string

  @Column('int', { default: 0 })
  tokenVersion: number

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
