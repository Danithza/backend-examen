import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Especialista extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre_completo: string

  @column()
  declare especialidad: string

  @column()
  declare registro_profesional: string

  @column({
    serialize: (value) => {
      if (typeof value === 'string') {
        try { return JSON.parse(value) } catch { return value }
      }
      return value
    },
    prepare: (value) => {
      if (typeof value === 'object') {
        return JSON.stringify(value)
      }
      return value
    },
  })
  declare dias_horarios: any

  @column()
  declare activo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
