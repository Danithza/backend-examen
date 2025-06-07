/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import EspecialistasController from '../app/controllers/especialistas_controller.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Rutas para especialistas
router.get('/especialistas', [EspecialistasController, 'index']) // listar activos
router.get('/especialistas/inactivos', [EspecialistasController, 'inactivos']) // listar inactivos
router.post('/especialistas', [EspecialistasController, 'store']) // crear
router.get('/especialistas/:id', [EspecialistasController, 'show']) // ver uno
router.put('/especialistas/:id', [EspecialistasController, 'update']) // actualizar
router.delete('/especialistas/:id', [EspecialistasController, 'destroy']) // soft delete
router.post('/especialistas/:id/restore', [EspecialistasController, 'restore']) // restaurar
router.delete('/especialistas/:id/force', [EspecialistasController, 'forceDelete']) // eliminar definitivo
