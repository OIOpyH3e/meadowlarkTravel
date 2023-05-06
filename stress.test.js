const loadtest = require('loadtest')


describe('stress test', function(){

    test('домашняя страница должна обрабатывать 50 запросов в секунду', done => {
        const options = {
            url: 'http://localhost:3000',
            concurrency: 4,
            maxRequests: 50,
        }
        loadtest.loadTest(options, (err,result) => {
            expect(!err)
            expect(result.totalTimeSeconds < 1)
            done()
        })
    })

})