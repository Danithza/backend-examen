import type { HttpContext } from '@adonisjs/core/http'
import Especialista from '../models/especialista.js'

interface RangoHorario {
  inicio: string
  fin: string
}

export default class EspecialistasController {
  // Obtener especialistas activos
  async index({ request }: HttpContext) {
    // Permitir ordenar por nombre o especialidad
    const orderBy = request.input('orderBy', 'nombre_completo')
    const direction = request.input('direction', 'asc')
    try {
      const especialistas = await Especialista.query()
        .where('activo', true)
        .orderBy(orderBy, direction)
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
  async store({ request }: HttpContext) {
    try {
      const data = request.only([
        'nombre_completo',
        'especialidad',
        'registro_profesional',
        'dias_horarios',
      ])

      // Validaciones básicas
      if (!data.nombre_completo || data.nombre_completo.length < 3) {
        return { error: 'El nombre completo debe tener al menos 3 caracteres' }
      }
      if (!data.especialidad) {
        return { error: 'La especialidad es obligatoria' }
      }
      if (!data.registro_profesional) {
        return { error: 'El registro profesional es obligatorio' }
      }

      // Validar unicidad de registro_profesional
      const existe = await Especialista.query()
        .where('registro_profesional', data.registro_profesional)
        .first()
      if (existe) {
        return { error: 'El número de registro profesional ya existe' }
      }

      // Validar estructura y traslapes de dias_horarios
      if (!data.dias_horarios || typeof data.dias_horarios !== 'object') {
        return { error: 'Los días y horarios son obligatorios y deben tener formato válido' }
      }
      if (this.hayTraslapes(data.dias_horarios)) {
        return { error: 'Hay traslapes en los horarios de atención' }
      }

      const especialista = await Especialista.create({
        ...data,
        activo: true,
      })
      return especialista
    } catch (error) {
      console.error('Error al crear el especialista:', error)
      return { error: 'Error al crear el especialista' }
    }
  }

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
  async update({ params, request }: HttpContext) {
    try {
      const data = request.only([
        'nombre_completo',
        'especialidad',
        'registro_profesional',
        'dias_horarios',
      ])
      const especialista = await Especialista.findOrFail(params.id)

      // Validaciones
      if (data.nombre_completo && data.nombre_completo.length < 3) {
        return { error: 'El nombre completo debe tener al menos 3 caracteres' }
      }
      if (
        data.registro_profesional &&
        data.registro_profesional !== especialista.registro_profesional
      ) {
        // Validar unicidad si cambia el registro
        const existe = await Especialista.query()
          .where('registro_profesional', data.registro_profesional)
          .whereNot('id', especialista.id)
          .first()
        if (existe) {
          return { error: 'El número de registro profesional ya existe' }
        }
      }
      if (data.dias_horarios) {
        if (this.hayTraslapes(data.dias_horarios)) {
          return { error: 'Hay traslapes en los horarios de atención' }
        }
      }

      especialista.merge(data)
      await especialista.save()
      return especialista
    } catch (error) {
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
