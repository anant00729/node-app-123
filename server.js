const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./config/database')
const path = require('path')
const request = require('request')
const http = require('http') 
const fetch = require('node-fetch');
const async = require('async')


const home_data = require('./util/home2.json')






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
            console.log(values);

            for (let _v of values) {
                let indexV = values.indexOf(_v)
                if(indexV !== 0){
                    Array.prototype.push.apply(values[0].results, _v.results);
                }
            }


            let homeList = home_data.homeList

            let results = values[0].results
            
            
            for(let h of homeList){
                let hIndex = homeList.indexOf(h)
                let j = 0
                for(let sub of h.subList){
                    if(j === 5){
                        break
                    }
                    
                    let _res 
                    let m_indx = (1+hIndex) * (j+1)

                    if(m_indx < results.length){
                        _res = results[m_indx].poster_path
                    }else {
                        _res = results[m_indx % results.length-1].poster_path
                    }
                    
                    
                    sub.image = `http://image.tmdb.org/t/p/w400${_res}`
                    ++j
                }
            }

            res.json({status : true, message : '', homeList})
            
        });

        

        

    } catch (error) {
        res.json({status : false , message : error.message})
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