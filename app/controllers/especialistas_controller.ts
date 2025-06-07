import type { HttpContext } from '@adonisjs/core/http'
import Especialista from '../models/especialista.js'


interface RangoHorario {
  inicio: string
  fin: string
}

export default class EspecialistasController {
  // Obtener especialistas activos
  async index({}: HttpContext) {
    try {
      const especialistas = await Especialista.query().where('activo', true)
      return especialistas
    } catch (error) {
      console.error('Error al obtener los especialistas:', error)
      return { error: 'Error al obtener los especialistas' }
    }
  }

  // Obtener especialistas inactivos
  async inactivos({}: HttpContext) {
    try {
      const especialistas = await Especialista.query().where('activo', false)
      return especialistas
    } catch (error) {
      console.error('Error al obtener inactivos:', error)
      return { error: 'Error al obtener inactivos' }
    }
  }
  // Crear un nuevo especialista

  // Mostrar un especialista por ID
  async show({ params }: HttpContext) {
    try {
      const especialista = await Especialista.findOrFail(params.id)
      return especialista
    } catch (error) {
      console.error('Error al obtener el especialista:', error)
      return { error: 'Error al obtener el especialista' }
    }
  }

  // Actualizar un especialista
  async update ({params, request}: HttpContext ){
    try{
      const data = request.only(['nombre_completo', 'especialidad', 'registro_profesional', 'dias_horarios'])
      const especialista = await Especialista.findOrFail(params.id)
      especialista.merge(data)
      await especialista.save()
      return especialista
    }catch(error){
      console.error('Error al actualizar el especialista:', error)
      return { error: 'Error al actualizar el especialista' }
    }
  }


  // Soft delete (marcar como inactivo)
  async destroy({ params }: HttpContext) {
    try {
      const especialista = await Especialista.findOrFail(params.id)
      especialista.activo = false
      await especialista.save()
      return { message: 'Especialista marcado como inactivo' }
    } catch (error) {
      console.error('Error al eliminar el especialista:', error)
      return { error: 'Error al eliminar el especialista' }
    }
  }

  // Restaurar especialista (activar)
  async restore({ params }: HttpContext) {
    try {
      const especialista = await Especialista.findOrFail(params.id)
      especialista.activo = true
      await especialista.save()
      return { message: 'Especialista restaurado correctamente' }
    } catch (error) {
      console.error('Error al restaurar el especialista:', error)
      return { error: 'Error al restaurar el especialista' }
    }
  }

  // Eliminar definitivamente
  async forceDelete({ params }: HttpContext) {
    try {
      const especialista = await Especialista.findOrFail(params.id)
      await especialista.delete()
      return { message: 'Especialista eliminado permanentemente' }
    } catch (error) {
      console.error('Error al eliminar definitivamente:', error)
      return { error: 'Error al eliminar definitivamente' }
    }
  }

  // Validación de traslapes internos en horarios
  private hayTraslapes(diasHorarios: Record<string, RangoHorario[]>): boolean {
    for (const dia in diasHorarios) {
      const rangos = diasHorarios[dia]
      rangos.sort((a, b) => a.inicio.localeCompare(b.inicio))
      for (let i = 1; i < rangos.length; i++) {
        if (rangos[i].inicio < rangos[i - 1].fin) {
          return true
        }
      }
    }
    return false
  }
}
