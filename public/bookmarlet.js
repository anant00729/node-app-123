(function(){
  console.log('Bookmarlet Starting')
  let _para = document.getElementsByTagName('p') 
  
  let _dashboardsidebar = document.getElementsByClassName('dashboard-sidebar js-sticky top-0 px-3 px-md-4 px-lg-4 overflow-auto')[0]
  if(_dashboardsidebar){
    _dashboardsidebar.style['background-color'] = '#4A5568'  
  }


  let _sideBar = document.getElementsByClassName('css-kq308b')[0]

  if(_sideBar){
    _sideBar.style['background-color'] = '#4A5568'  
  }
  


  let _body = document.getElementsByClassName('logged-in env-production page-responsive page-profile mine')[0]

  if(_body){
    _body.style['background-color'] = '#4A5568'  
  }


  let _mediumBody = document.getElementsByClassName('a b c')[0]
  

  if(_mediumBody){
    _mediumBody.style['background-color'] = 'green' 
  }
  

  
  for(let i = 0 ; i < _para.length ; ++i){
       _para[i].innerHTML = 'Hello World!'
      //_para[i].style['background-color'] = '#2C5282'
  }
})()



