import { Elysia, t } from 'elysia'
import { prisma } from '../db'

export const settings = new Elysia({ prefix: '/settings' })

//settings.post
settings.post('/', async ({ body, set }) => {
    try {
    const row = await prisma.settings.findFirst({
        where: { id: 1 }
    })

    if (!row) {
      set.status = 400
      return {
        success: false,
        message: 'Something went wrong'
      }
    }
    return prisma.$transaction(async tx => {
        return tx.settings.update({
            where: { id: 1 },
            data: {
                config: body.data
            }
        })
    })

    } catch (error) {
        console.error('Error creating data:', error)
        set.status = 500
        return {
            success: false,
            message: 'Internal server error'
        }
    }

}, {
    body: t.Object({
        data: t.Record(t.String(), t.Any())
    }),
    detail: {description: "Сохранить настройки"}
})

settings.get("/", async ({set}) => {
  try{

    const settingsRow = await prisma.settings.findFirst({
            where: { id: 1 }
    })

    if(!settingsRow) {
      set.status = 400
      return {
        success: false,
        message: 'Something went wrong'
      }
    }

    return settingsRow.config

  }catch (error) {
        console.error('Error creating data:', error)
        set.status = 500
        return {
            success: false,
            message: 'Internal server error'
        }
    }
}, {
       detail: {description: "Получить настройки"}
})
//settings.get