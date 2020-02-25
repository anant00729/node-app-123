(function(){
  console.log('Bookmarlet Starting')
  let _para = document.getElementsByTagName('p') 
  for(let i = 0 ; i < _para.length ; ++i){
       _para[i].innerHTML = 'Hello World!'
      //_para[i].style['background-color'] = '#2C5282'
  }
})()



