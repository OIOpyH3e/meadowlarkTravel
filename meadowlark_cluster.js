const cluster = require('cluster')

function startWorker() {
    const worker = cluster.fork()
    console.log(`КЛАСТЕР: Исполнитель ${worker.id} запущен`)
}

if(cluster.isMaster){

    require('os').cpus().forEach(startWorker)

    // Записываем в лог все отключившиеся исполнители;
    // если исполнитель отключается, он должен затем
    // завершить работу, так что мы подождем
    // события завершения работы для порождения 
    // новоого исполнителя ему на замену.
    cluster.on('disconnect', worker => console.log(
        `КЛАСТЕР: Исполнитель ${worker.id} отключился от кластера.`
    ))

    // Когда исполнитель завершает работу
    // создаем исполнитель ему на замену.
    cluster.on('exit', (worker, code, signal) => {
        console.log(
            `КЛАСТЕР: Исполнитель ${worker.id} завершил работу ` + 
            `с кодом завершения ${code} (${signal})`
        )
        startWorker
    })
    } else {
        /* eslint-disable no-undef */
        const port = process.env.PORT || 3000
        /* eslint-enable no-undef */
        // Запускаем наше приложение на исполнителе;
        // см. meadowlark.js
        require('./meadowlark.js')(port)
    }