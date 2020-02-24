const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./config/database')
const path = require('path')
const request = require('request')
const http = require('http') 
const fetch = require('node-fetch');
const async = require('async')


//** 
//VMName : TCP-WI-COS-OFENG1
//DNS :tcp-wi-cos-ofeng1.westindia.cloudapp.azure.com



var NodeGeocoder = require('node-geocoder');


var options = {
    provider: 'google',
   
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyAVVrpEllgZX3FZwC6RI6Oy0kuXUhN79v8', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };



var geocoder = NodeGeocoder(options);


const { performance } = require('perf_hooks')





const collectedOffers = require('./util/collected/collected.json')
const usedOffers = require('./util/collected/used.json')
const expiredOffers = require('./util/collected/expired.json')
const sharedWithMe = require('./util/collected/shared_with_me.json')

const home_data = require('./util/home2.json')
const location_data = require('./util/location/getLocation.json')
const old_location_data = require('./util/location.json')

const home_offers = require('./util/home/homeOffers.json')
const home_offers_ios = require('./util/home/homeOffersiOS.json')

const collectedOffersList = require('./util/collectOfferNew.json')
const testDummyUsers = require('./util/testDummyUsers.json')


const xlsx = require("xlsx")





// Test DB 
db.authenticate()
.then(()=> {
    console.log('connected to the database')
})
.catch((err)=> {
    console.log('faild to connect', err.message)
})



const app = express()


app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())




app.use('/api/auth' , require('./routes/user'))
app.use('/api/quiz' , require('./routes/quiz'))





const PORT = process.env.PORT || 8084




// app.get('/', (req,res)=> {
//     res.json({Hellloe : "helo all"})
// })



//app.use(express.static('./public'))
//app.use(express.static('./public/build'))

//app.use(express.static(path.join(__dirname, 'public/build')));
// Set static folder






app.get('/homeOfferios', (req,res)=> {
    res.json(home_offers_ios)
})




const MOV_URL = "https://api.themoviedb.org/3/movie/now_playing?api_key=578152be1392218f6d775ceb67b4e4f6&language=en-US&page="

app.get('/getAllMovies', async (req,res)=> {
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



app.get('/getAllMoviesForHomePage', async (req,res)=> {
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

        let allMovies = []

        Promise.all(arrPromise).then(function(values) {

            for(v of values){


                for(mov of v.results){
                    mov.poster_path = `http://image.tmdb.org/t/p/w400${mov.poster_path}`
                    mov.backdrop_path = `http://image.tmdb.org/t/p/w400${mov.backdrop_path}`
                    allMovies.push(mov)
                }
            }

            res.json({status : true , allMovies})

        })
    }catch(error){
        res.json({status : false , Message : `${error}`})
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


const offerOnline = require('./util/offerDetailsOnline.json')
const offerOmni = require('./util/offerDetailsOmni.json')
const offerOffline = require('./util/offerDetailsOffine.json')
const demo3 = require('./util/home_offers/td_Demo3.json')
const demo4 = require('./util/home_offers/td_Demo4.json')
const demo5 = require('./util/home_offers/td_Demo5.json')

app.post('/offerdetails', (req,res)=>{

    const offerId = req.body.offerId

    if(offerId === '586137cd-828f-4f3c-9afc-1b618c090ed6'){
        res.json(offerOffline)
    }else if(offerId === 'd21ed022-b54b-4657-8b17-9da124a06b0c'){
        res.json(offerOnline)
    }
    else if(offerId === 'TD_Demo3'){
        res.json(demo3)
    }else if(offerId === 'TD_Demo4'){
        res.json(demo4)
    }else if(offerId === 'TD_Demo6') {
        res.json(demo5)
    }
    else {
        res.json(offerOmni)
    }
    
})

app.get('/homeOffers',(req,res) => {
    res.json(home_offers)
})


var offer_images = [
    "https://assets.tatacliq.com/medias/sys_master/managed/17059162685470.jpg",
    "https://assets.tatacliq.com/medias/sys_master/managed/17059163209758.jpg",
    "https://assets.tatacliq.com/medias/sys_master/managed/17059162816542.jpg",
    "https://assets.tatacliq.com/medias/sys_master/managed/17059162947614.jpg",
    "https://assets.tatacliq.com/medias/sys_master/managed/17059163078686.jpg"
]


app.post('/getLocation', (req,res)=> {

    const lat = req.body.latitude || "18.936244"
    const long = req.body.longitude || "72.833981"


    let locationData = {...location_data}

    locationData.data = locationData.data.map((_lObj) => {
        let distance = getDistanceFromLatLonInKm(lat, long, _lObj.storeLat, _lObj.storeLong)
        _lObj.storeLat = _lObj.storeLat.toString()
        _lObj.storeLong = _lObj.storeLong.toString()
        _lObj.distance = distance
        return _lObj
    })

    locationData.data = locationData.data.sort((a, b) => a.distance - b.distance);
    locationData.data = locationData.data.splice(0 , 10)

    res.json(locationData)


    //res.json(old_location_data)

    
})


app.get('/collectedofferList', (req,res)=> {
    res.json(collectedOffersList)
})

app.post('/singleHomeOfferDetails',(req,res) => {


    const offerId = req.body.offerId || 10
    const catId = req.body.catId || 100


    const catObj = home_offers.offersList.find(cat => cat.id === catId)
    if(catObj){
        
        const mainOffer = catObj.subOffersList.find(offer => offer.id === offerId)
        if(mainOffer){
            let arrImages = [...offer_images]


            mainOffer.tnc = `<div><h2><strong>Terms and Conditions</strong></h2><ol style="list-style: bullet;padding-left: 12px;"><li>Valid on booking period: Till 30th Jan 20</li><li>Valid on travel period: Till 30th Jan 20</li><li>For any card related claims/issues, the customer shall approach their respective \"Issuing Bank\". Platform shall not entertain any such claims where the card wasn't accepted, or the card was showing invalid.</li></ol></div>`
            arrImages = shuffle(arrImages)
            if(arrImages.length === 5){
                arrImages.splice(arrImages.length - 2, 2)
            }
            mainOffer.images = arrImages
            
            res.json({status : true, message : '' , singleOffer : mainOffer})
        }else {
            res.json({status : false, message : 'Offer not found' })
        }

    }else {
        res.json({status : false, message : 'Category not found' })
    }
})


function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return array
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


app.get('/bubbleSort', (req,res)=> {

    let inputData = [64, 34, 25, 12, 22, 11, 90]

    let lastIndex = inputData.length

    let temp = -1


    for(let i = 0; i < lastIndex ; ++i){
        
        for(let j = 0; j < lastIndex - (i + 1); ++j){
            if(i == 0){
                if(inputData[j] > inputData[j+1]){
                    temp = inputData[j]
                    inputData[j] = inputData[j+1]
                    inputData[j+1] = temp
                }
            }
            
        }
    }


    res.json({Status : true, Message : '', sortedData : inputData})
})


// app.use(express.static('public/build'));
// app.use(express.static('public'));



// app.get('*', (req,res)=> {
//     ///app.use(express.static('public/build'))
//     //res.sendFile(path.join(__dirname+'/public/build/index.html'));
    
//     res.sendFile(path.resolve(__dirname, 'public', 'build', 'index.html'))
//     //res.sendFile(path.resolve(__dirname, 'public/build', 'index.html'))
// })



app.get('/getAllUsers', (req,res)=>{
    res.json(testDummyUsers)
})


app.get('/myofferslist', (req,res)=> {
    let status = req.query.status  

    if(status === 'used'){
        res.json(usedOffers)
    }else if(status === 'expired'){
        res.json(expiredOffers)
    }else if(status === 'shared'){
        res.json(sharedWithMe)
    }
    else {
        res.json(collectedOffers)
    }


})



app.post('/syncTCPContacts', (req,res)=> {
    let body = req.body

    let randomArray = []

    for(let i = 0 ; i < 5 ; ++i){
        randomArray.push(body[getRandomInt(0, req.body.length)]) 
    }

    
    res.json({status : true , data : randomArray})


})



app.get('/getLocationTest', (req,res) => {
    let mainResult = []
    var workbook = xlsx.readFile('location.xlsx');
    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        const xlDataSheet2 = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
        

        for (var x in xlDataSheet2) {
            
            let _l = xlDataSheet2[x]


            if(x !== "0"){

                let distance = getDistanceFromLatLonInKm(18.936244, 72.833981, 
                    _l["__EMPTY_2"] ? _l["__EMPTY_2"] : "", 
                    _l["__EMPTY_3"] ? _l["__EMPTY_3"] : "")


                
                let locationObj = {}    
                locationObj.storeName = _l["__EMPTY_1"] ? _l["__EMPTY_1"] : ""
                locationObj.storeLat = _l["__EMPTY_2"] ? _l["__EMPTY_2"] : ""
                locationObj.storeLong = _l["__EMPTY_3"] ? _l["__EMPTY_3"] : ""
                locationObj.storeDescription = ""
                locationObj.storeAddress = ""
                locationObj.storeContactNumber = ""
                locationObj.distance = distance
                mainResult.push(locationObj)
            }
		}
        
    });


    mainResult = mainResult.sort(function(a, b){return a.distance - b.distance});
    //mainResult = mainResult.splice(0 , 10)


    


    res.json({ status : 200 , data : mainResult})
})



app.get('/testingOnVM', (req,res) => {
    res.json({status : true , Message : 'Welcome to the Offers Mock API'})
})




app.get('/mapLocationAddress', (req,res) => {
    let mainResult = []
    var workbook = xlsx.readFile('location.xlsx');
    var workbook_1 = xlsx.readFile('store_master.xlsx');
    var sheet_name_list = workbook.SheetNames;
    var sheet_name_list_1 = workbook_1.SheetNames;


    // sheet_name_list_1.forEach(function(y) {

    //     const xlDataSheet_1 = xlsx.utils.sheet_to_json(workbook_1.Sheets[sheet_name_list_1[0]])

    //     for (var y in xlDataSheet_1) {
    //         console.log('y', y)
    //     }
        
    // })


    sheet_name_list.forEach( async (y) =>  {
        var worksheet = workbook.Sheets[y];
        const xlDataSheet2 = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
        

        for (var x in xlDataSheet2) {
            
            let _l = xlDataSheet2[x]


            if(x !== "0"){

                let distance = getDistanceFromLatLonInKm(18.936244, 72.833981, 
                    _l["__EMPTY_2"] ? _l["__EMPTY_2"] : "", 
                    _l["__EMPTY_3"] ? _l["__EMPTY_3"] : "")



                let lati = _l["__EMPTY_2"] ? _l["__EMPTY_2"] : ""  
                
                let lngi =_l["__EMPTY_3"] ? _l["__EMPTY_3"] : ""

                // Using callback
                let address = await geocoder.reverse({ lat: lati, lon : lngi});
                let locationObj = {}    
                    locationObj.storeName = _l["__EMPTY_1"] ? _l["__EMPTY_1"] : ""
                    locationObj.storeLat = _l["__EMPTY_2"] ? _l["__EMPTY_2"] : ""
                    locationObj.storeLong = _l["__EMPTY_3"] ? _l["__EMPTY_3"] : ""
                    locationObj.storeDescription = ""
                    locationObj.storeAddress = ""
                    locationObj.storeContactNumber = ""
                    locationObj.distance = distance

                if(address){
                    locationObj.geoAddress = address
                }

                mainResult.push(locationObj)
   


                
                
            }
		}
        
    });


    // mainResult = mainResult.sort(function(a, b){return a.distance - b.distance});
    // mainResult = mainResult.splice(0 , 10)


    


    res.json({ status : 200 , data : mainResult})
})


app.get('/callQuickSort' , (req,res , next) => {
    const arrList = [10 , 80 , 30 , 90 , 40 , 50 , 70]
    quickSort(arrList ,  0 , arrList.length-1)
    res.json({arrList})
})



function partition(arr, low , high){
    let pivot = arr[low]
    let i = low
    let j = high



    while(i < j){
        
        do{
            ++i
        }while(arr[i] <=  pivot)
    
    
        do{
            --j
        }while(arr[j] > pivot)

        if(i < j){
            let temp = -1
            temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp 

            
        }
    }

    let temp2 = -1
    temp2 = arr[low]
    arr[low] = arr[j]
    arr[j] = temp2 
    return j
}

function quickSort(arr ,  low , high ){

    if(low < high){
        let j = partition(arr, low , high)
        quickSort(arr ,  low , j )
        quickSort(arr ,  j + 1 , high )
    }
    
}


function calDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }


app.listen(PORT, () => {
    console.log(`the app is running on ${PORT}`);
})


