import { ResponseToolkit, Server } from "@hapi/hapi"
import { createItem,deleteItem,getAllItems,getOneItem,updateItem } from "./services"
import { validateCreate, validateUpdate } from "./joiValidations"
interface CustomRequest extends Request {
    params: any
    payload: {
        id?:number
        name?: string;
        price?: number;
    }
}
export const defineRoutes = (server: Server) => {
    server.route({
        method: 'GET',
        path: '/ping',
        handler: async (request, h) => {
            return {
                ok: true
            }
        }
    })  
    server.route({
        method: 'GET',
        path: '/items/{id}',
        handler: async (CustomRequest, h) => {
            try{
                const id= CustomRequest.params.id;
                const item=await getOneItem(id)
                if(!item) return h.response(`Item no existe, id ${id}`).code(404);
                return h.response({id:item?.id,name:item?.name,price:item?.price
                }).code(200)
            } catch(error) {
                console.error('Error reading items:', error)
                return h.response({
                    error: 'Error al leer items',
                    message: error.message || 'Ocurrió un error inesperado'
                }).code(500)
            }
        }
    })  
    server.route({
        method: 'GET',
        path: '/items',
        handler: async (CustomRequest, h) => {
            try{
                return getAllItems()

            } catch(error) {
                console.error('Error reading items:', error)
                return h.response({
                    error: 'Error al leer items',
                    message: error.message || 'Ocurrió un error inesperado'
                }).code(500)
            }
        }
    })  
    server.route({
        method: 'POST',
        path: '/items',
      
        handler: async (request: CustomRequest, h: ResponseToolkit) => {
            try {
                const validation=await validateCreate(request.payload)
                if(!!validation) {
                    return h.response(validation).code(400)  
                } 
                    const { name, price , } = request.payload as {
                    name:string,
                    price:number
                }
              

                const item = await createItem({
                    name, price
                })

                return h.response({
                    id:item.id,
                    name:item.name,
                    price:item.price
                }).code(201)

            } catch (error) {
                console.error('Error creating item:', error)
                return h.response({
                    error: 'Error al crear item',
                    message: error.message || 'Ocurrió un error inesperado'
                }).code(500)
            }
        }
    })
    server.route({
        method: 'PUT',
        path: '/items/{id}',
        handler: async (request: CustomRequest, h: ResponseToolkit) => {
            try {
                const validation=await validateUpdate(request.payload)
                if(!!validation) {
                    return h.response(validation).code(400)  
                } 
                const { name, price } = request.payload as {
                    name?:string,
                    price?:number
                }
                const id= request.params.id;
                let item= await getOneItem(id);
                if(!item) return h.response({message:`El item con el id ${id} no existe`}).code(404)
                 item = await updateItem(
                    id,{name, price}
                )

                return h.response({
                    id:item?.id,
                    name:item?.name,
                    price:item?.price                }).code(200)

            } catch (error) {
                console.error('Error updating item:', error)
                return h.response({
                    error: 'Error al actualizar item',
                    message: error.message || 'Ocurrió un error inesperado'
                }).code(500)
            }
        }
    })
    server.route({
        method: 'DELETE',
        path: '/items/{id}',
        handler: async (request: CustomRequest, h: ResponseToolkit) => {
            try {
                const id  = request.params.id;
                let item= await getOneItem(id);
                if(!item) return h.response({message:`El item con el id ${id} no existe`}).code(404)
                 
                await deleteItem(
                    id
                )

                return h.response(
                    'Deleted'
                ).code(204)

            } catch (error) {
                console.error('Error deleting item:', error)
                return h.response({
                    error: 'Error al eliminar item',
                    message: error.message || 'Ocurrió un error inesperado'
                }).code(500)
            }
        }
    })
}