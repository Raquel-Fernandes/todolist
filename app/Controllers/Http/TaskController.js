'use strict'

const Task              =   use('App/Models/Task')
const { validateAll }   =   use('Validator') 

class TaskController {

    async index({ view }){
        const tasks         =   await Task.all()
        const tasksJSON     =   tasks.toJSON()

        return view.render('task', {
            title   : 'Latest Tasks',
            tasks   : tasksJSON
        })
    }
    add({ view }){
        return view.render('add')
    }

    async store({ request, response, session }){
        const message       = {
            'title.required' : 'Required',
            'title.min': 'min 5',
            'title.max': 'max 140',
            
        }
        const validation    = await validateAll(request.all(), {
            title   :  'required|min:5|max:140',
            body    :  'required|min:10'
        }, message)
        const task          = new Task()

        if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }
        

        task.title  = request.input('title')
        task.body   = request.input('body')

        await task.save()

        session.flash({ notification: 'Task added!' })

        return response.redirect('/task')
    }
    async detail({ params, view }){
        const task = await Task.find(params.id)

        return view.render('detail', {
            task: task
        })
    }
    async remove({ params, response, session }){
        const task = await Task.find(params.id)
        await task.delete()
        session.flash({notification: 'Task removed!'})

        return response.redirect('/task')
    }
}

module.exports = TaskController
