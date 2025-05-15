import { Elysia, t } from 'elysia'
import { prisma } from '../db'

export const settings = new Elysia({ prefix: '/settings' })

//settings.post

//settings.get