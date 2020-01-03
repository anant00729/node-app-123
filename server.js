const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./config/database')
const path = require('path')
const request = require('request')
const http = require('http') 
const fetch = require('node-fetch');

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


const MOV_URL = "https://api.themoviedb.org/3/movie/now_playing?api_key=578152be1392218f6d775ceb67b4e4f6&language=en-US&page=3"

app.get('/test', async (req,res)=> {
    try {
        const data = await fetch(MOV_URL)
        const response = await data.json()

        let homeList = home_data.homeList

        let results = response.results
        let i = 0
        
        for(let h of homeList){
            let j = 0
            for(let sub of h.subList){
                if(j === 5){
                    break
                }
                let _i = i + 1
                let _j = j + 1
                let _res = results[_i*_j % results.length].poster_path
                sub.image = `http://image.tmdb.org/t/p/w400${_res}`
                ++j
            }
            ++i
        }

        res.json({status : true, message : '', homeList})

    } catch (error) {
        res.json({status : false , message : error.message})
    }    
})

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