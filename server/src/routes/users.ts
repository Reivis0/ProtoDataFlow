import { Elysia, t } from 'elysia'
import { prisma } from '../db'

export const users = new Elysia({ prefix: '/users' })

users.post(
  '/',
  async ({ body, set }) => {
    try {
      const existingUser = await prisma.user.findFirst({
        where: { login: body.login }
      })

      if (existingUser) {
        set.status = 400
        return {
          success: false,
          message: 'User with this login already exists'
        }
      }

      const user = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            level: body.level,
            login: body.login,
            password: body.password,
            //password: await Bun.password.hash(body.password),
          
            surname: body.surname || '',
            name: body.name || '',
            patronymic: body.patronymic || '',
            access: body.access ?? false,
            startDate: body.startDate ? new Date(body.startDate) : null,
            endDate: body.endDate ? new Date(body.endDate) : null, 
            email: body.email || '',
            phone: body.phone || '',
            comment: body.comment || '',
            agreement: body.agreement ?? false,
            modelsMetadata: body.modelsMetadata || []
          }
        })

        // await tx.userData.create({
        //   data: {
        //     user: { connect: { id: user.id } },
        //     key: "Init",
        //     value: {}
        //   }
        // })

        return user
      })

      set.status = 201
      return {
        success: true,
        data: {
          id: user.id,
          login: user.login,
          level: user.level,
          createdAt: user.createdAt
        }
      }
    } catch (error) {
      console.error('Error creating user:', error)
      set.status = 500
      return {
        success: false,
        message: 'Internal server error'
      }
    }
  },
  {
    body: t.Object({
      level: t.String(),
      login: t.String({ minLength: 1 }),
      password: t.String({ minLength: 1 }),
      
      surname: t.Optional(t.String()),
      name: t.Optional(t.String()),
      patronymic: t.Optional(t.String()),
      access: t.Optional(t.Boolean({ default: false })),
      startDate: t.Optional(t.String({ format: 'date-time' })),
      endDate: t.Optional(t.String({ format: 'date-time' })),
      email: t.Optional(t.String({ format: 'email' })),
      phone: t.Optional(t.String()),
      comment: t.Optional(t.String()),
      agreement: t.Optional(t.Boolean({ default: false })),
      modelsMetadata: t.Optional(t.Record(t.String(), t.Any()))
    }),
    detail: {description: "Создать пользователя"}
  }
)

users.patch(
  '/:login',
  async ({ params: { login }, body, set }) => {
    try {
      const existingUser = await prisma.user.findFirst({
        where: { login }
      });

      if (!existingUser) {
        set.status = 404;
        return {
          success: false,
          message: 'User not found'
        };
      }

      const updatedUser = await prisma.user.update({
        where: { login },
        data: {
          level: body.level,
          password: body.password,
          surname: body.surname,
          name: body.name,
          patronymic: body.patronymic,
          access: body.access,
          startDate: body.startDate ? new Date(body.startDate) : undefined,
          endDate: body.endDate ? new Date(body.endDate) : undefined,
          email: body.email,
          phone: body.phone,
          comment: body.comment,
          agreement: body.agreement,
          modelsMetadata: body.modelsMetadata
        }
      });

      return {
        success: true,
        data: {
          id: updatedUser.id,
          login: updatedUser.login,
          level: updatedUser.level,
          updatedAt: updatedUser.updatedAt
        }
      };
    } catch (error) {
      console.error('Error updating user:', error);
      set.status = 500;
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  },
  {
    body: t.Object({
      level: t.Optional(t.String()),
      password: t.Optional(t.String({ minLength: 1 })),
      surname: t.Optional(t.String()),
      name: t.Optional(t.String()),
      patronymic: t.Optional(t.String()),
      access: t.Optional(t.Boolean()),
      startDate: t.Optional(t.String({ format: 'date-time' })),
      endDate: t.Optional(t.String({ format: 'date-time' })),
      email: t.Optional(t.String({ format: 'email' })),
      phone: t.Optional(t.String()),
      comment: t.Optional(t.String()),
      agreement: t.Optional(t.Boolean()),
      modelsMetadata: t.Optional(t.Record(t.String(), t.Any()))
    }),
    params: t.Object({
      login: t.String()
    }),
    detail: {description: "Изменить данные пользователя"}
  }
);

users.delete('/:login', async ({ params: { login }, set }) => {
  try {
    await prisma.user.delete({ where: { login } })
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
      set.status = 500
      return {
        success: false,
        message: 'Internal server error'
      }
  }
}, {
  detail: {description: "удалить пользователя"}
})

users.post(
  '/:login/agree',
  async ({ params: { login }, set }) => {
    try {
      const existingUser = await prisma.user.findFirst({
        where: { login }
      });

      if (!existingUser) {
        set.status = 404;
        return {
          success: false,
          message: 'User not found'
        };
      }

      const updatedUser = await prisma.user.update({
        where: { login },
        data: {
          agreement: true
        }
      });

      return {
        success: true,
        data: {
          id: updatedUser.id,
          login: updatedUser.login,
          agreement: updatedUser.agreement,
          updatedAt: updatedUser.updatedAt
        }
      };
    } catch (error) {
      console.error('Error updating user agreement:', error);
      set.status = 500;
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  },
  {
    params: t.Object({
      login: t.String()
    }),
    detail: {description: "Поставить галочку о согласии"}
  }
);

users.get("/", async ({set}) => {
  try{

    return prisma.user.findMany({

    })

  }catch (error) {
        console.error('Error creating data:', error)
        set.status = 500
        return {
            success: false,
            message: 'Internal server error'
        }
    }
}, {
       detail: {description: "Получить всех пользователей"}
})

//Проверка 
