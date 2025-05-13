import { Elysia, t } from 'elysia'
import { prisma } from '../db'
export const data = new Elysia({ prefix: '/data' })
data.post('/:login', async ({ body, set, params }) => {
    try {
        const existingData = await prisma.userData.findFirst({
            where: { user: { login: params.login }, key: body.key }
        })
        if (existingData) {
            set.status = 400
            return {
                success: false,
                message: 'Data with this key already exists'
            }
        }
        console.log(body);
        console.log(body.value.specialFieldForModels_ddqasdawd, "data all models")
        // return prisma.userData.create({

        //     data:{
        //         user:{connect:{login:params.login}}, key:body.key, value: body.value
        //     }
        // })
        return prisma.$transaction(async tx => {
            await tx.user.update({ where: { login: params.login }, data: { modelsMetadata: body.value.specialFieldForModels_ddqasdawd } })
            return tx.userData.create({

                data: {
                    user: { connect: { login: params.login } }, key: body.key, value: body.value.data_awdfasda
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
        key: t.String(),
        value: t.Record(t.String(), t.Any())
    }),
    params: t.Object({
        login: t.String()
    }),
    detail: {description: "Добавить новую модель"}
})

data.get('/:login/:key', async ({set, params }) => {
    try{

        //console.log(params)
        const informationAboutModels = await prisma.user.findFirst({
            where: { login: params.login }
        })

         if (!informationAboutModels) {
                set.status = 404
                return {
                    success: false,
                    message: 'User not found'
                }
            }

        let existingData;
        if(params.key !== "no")
        {   existingData = await prisma.userData.findFirst({
                where: { user: { login: params.login }, key: params.key }
            })
            if (!existingData) {
                set.status = 404
                return {
                    success: false,
                    message: 'Data not found'
                }
            }
            existingData = existingData.value
        }
        else{
            existingData = { "initial-data": {}, "initial-requrements": [], "all-objects": [], "forMatricies": {}, "traceability-matricies-data": {}, "compliance-matricies-data": {} }
        }
        

        return {data_awdfasda: existingData, specialFieldForModels_ddqasdawd: informationAboutModels.modelsMetadata};


    } catch (error) {
        console.error('Error creating data:', error)
        set.status = 500
        return {
            success: false,
            message: 'Internal server error'
        }
    }
}, {params: t.Object({
    login: t.String(),
    key: t.String()
    }),
     detail: {description: "Получить модель"}
})

data.patch('/:login', async ({body, set, params }) => {
        try{
            const existingData = await prisma.userData.findFirst({
            where: { user: { login: params.login }, key: body.old }
        })
        if (!existingData) {
            set.status = 404
            return {
                success: false,
                message: 'Data not found'
            }
        }
        const currentUser = await prisma.user.findFirst({
            where: { login: params.login }
        })
        if(!currentUser){
                        set.status = 404
            return {
                success: false,
                message: 'User not found'
            }
        }
        await prisma.userData.update({
            where: {user_key_unique: {key:body.old, userId: currentUser.id}}, data: {key: body.new}
            })
        
        await prisma.user.update({
            where: { login: params.login }, data:{ modelsMetadata: body.updatedInfo}
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
        old: t.String(),
        new: t.String(),
        updatedInfo: t.Any()

    }),
    params: t.Object({
        login: t.String()
    }),
    detail: {description: "Изменить название в модели"}
})

data.put('/:login/:key', async({body, set, params }) => {
    try{

        console.log(body)
        const existingData = await prisma.userData.findFirst({
            where: { user: { login: params.login }, key: params.key }
        })
        if (!existingData) {
            set.status = 404
            return {
                success: false,
                message: 'Data not found'
            }
        }

        const currentUser = await prisma.user.findFirst({
            where: { login: params.login }
        })
        if(!currentUser){
                        set.status = 404
            return {
                success: false,
                message: 'User not found'
            }
        }

        await prisma.user.update({
            where: { login: params.login }, data:{ modelsMetadata: body.model.specialFieldForModels_ddqasdawd}
        })

        await prisma.userData.update({
            where: {user_key_unique: {key:params.key, userId: currentUser.id}}, data: {value: body.model.data_awdfasda}
        })

        set.status = 200;
        return {
            success: true,
            message: 'Data updated successfully'
        }
        


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
        model: t.Record(t.String(), t.Any())
    }),
    params: t.Object({
        login: t.String(),
        key: t.String()
    }),
    detail: {description: "Изменить существющую модель"}
})