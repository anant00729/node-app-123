const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./config/database')
const path = require('path')
const request = require('request')
const http = require('http') 
const fetch = require('node-fetch');
const async = require('async')
const { performance } = require('perf_hooks')




const home_data = require('./util/home2.json')

const home_offers = require('./util/homeOffers.json')






// Test DB 
db.authenticate()
.then(()=> console.log('connected to the database'))
.catch((err)=> console.log('faild to connect', err.message))



const app = express()


app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())




app.use('/api/auth' , require('./routes/user'))
app.use('/api/quiz' , require('./routes/quiz'))





const PORT = process.env.PORT || 3001


// app.get('/', (req,res)=> {
//     res.json({Hellloe : "helo all"})
// })



//app.use(express.static('./public'))
//app.use(express.static('./public/build'))

//app.use(express.static(path.join(__dirname, 'public/build')));
// Set static folder


const MOV_URL = "https://api.themoviedb.org/3/movie/now_playing?api_key=578152be1392218f6d775ceb67b4e4f6&language=en-US&page="

app.get('/test', async (req,res)=> {
    try {

        var t0 = performance.now();
  
        let arrPromise = []


        

        for(let k = 0 ; k < 5 ; k++){
            var _promise = new Promise(async(resolve, reject)=> {
                const data = await fetch(`${MOV_URL}${k+1}`)
                const response = await data.json()
                resolve(response)
            });
            arrPromise.push(_promise)
        }


        

        Promise.all(arrPromise).then(function(values) {

            var t1 = performance.now();
            console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");

            for (let _v of values) {
                let indexV = values.indexOf(_v)
                if(indexV !== 0){
                    Array.prototype.push.apply(values[0].results, _v.results);
                }
            }


            let homeList = home_data.homeList

            let results = values[0].results
            
            let l = 0
            
            for(let h of homeList){
                let hIndex = homeList.indexOf(h)
                let j = 0
                
                for(let sub of h.subList){
                    if(j === 5){
                        break
                    }
                    
                    let _res 
                    let m_indx = l

                    if(m_indx < results.length){
                        _res = results[m_indx].poster_path
                        sub.name = results[m_indx].original_title
                        sub.id = l
                    }else {
                        _res = results[m_indx % results.length-1].poster_path
                        sub.name = results[m_indx % results.length-1].original_title
                        sub.id = l
                    }
                    
                    
                    sub.image = `http://image.tmdb.org/t/p/w400${_res}`
                    
                    ++j
                    ++l
                }
            }


            

            res.json({status : true, message : '', homeList})
            
        });

        

        

    } catch (error) {
        res.json({status : false , message : error.message})
    }    
})



app.get('/test1', async (req,res)=> {
    try {

        var t0 = performance.now();
  
        let objParellel = {}


        

        for(let k = 0 ; k < 5 ; k++){
            objParellel[`${k}`] =  (callback) => {
                // const data = await fetch(`${MOV_URL}${k+1}`)
                // const response = await data.json()
                callback(null,`${k}`)
            }
        }


        

        async.parallel(objParellel, (err, values)=> {

            console.log('err', err)
            // console.log('values', values)

            // var t1 = performance.now();
            // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");

            // for (let _v of values) {
            //     let indexV = values.indexOf(_v)
            //     if(indexV !== 0){
            //         Array.prototype.push.apply(values[0].results, _v.results);
            //     }
            // }


            // let homeList = home_data.homeList

            // let results = values[0].results
            
            // let l = 0
            
            // for(let h of homeList){
            //     let hIndex = homeList.indexOf(h)
            //     let j = 0
                
            //     for(let sub of h.subList){
            //         if(j === 5){
            //             break
            //         }
                    
            //         let _res 
            //         let m_indx = l

            //         if(m_indx < results.length){
            //             _res = results[m_indx].poster_path
            //             sub.name = results[m_indx].original_title
            //             sub.id = l
            //         }else {
            //             _res = results[m_indx % results.length-1].poster_path
            //             sub.name = results[m_indx % results.length-1].original_title
            //             sub.id = l
            //         }
                    
                    
            //         sub.image = `http://image.tmdb.org/t/p/w400${_res}`
                    
            //         ++j
            //         ++l
            //     }
            // }


            

            // res.json({status : true, message : '', homeList})
            
        });

        

        

    } catch (error) {
        res.json({status : false , message : error.message})
    }    
})



app.get('/homeOffers',(req,res) => {
    res.json(home_offers)
})


app.post('/singleHomeOfferDetails',(req,res) => {


    const offerId = req.body.offerId || 10
    const catId = req.body.catId || 100


    const catObj = home_offers.offersList.find(cat => cat.id === catId)
    if(catObj){
        
        const mainOffer = catObj.subOffersList.find(offer => offer.id === offerId)
        if(mainOffer){
            res.json({status : true, message : '' , singleOffer : mainOffer})
        }else {
            res.json({status : false, message : 'Offer not found' })
        }

    }else {
        res.json({status : false, message : 'Category not found' })
    }
})


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// app.use(express.static('public/build'));
// app.use(express.static('public'));



// app.get('*', (req,res)=> {
//     ///app.use(express.static('public/build'))
//     //res.sendFile(path.join(__dirname+'/public/build/index.html'));
    
//     res.sendFile(path.resolve(__dirname, 'public', 'build', 'index.html'))
//     //res.sendFile(path.resolve(__dirname, 'public/build', 'index.html'))
// })












app.listen(PORT, () => {
    console.log(`the app is running on ${PORT}`);
})