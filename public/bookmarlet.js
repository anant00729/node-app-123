(function(){
  console.log('Bookmarlet Starting')
  let _para = document.getElementsByTagName('p') 
  
  let _dashboardsidebar = document.getElementsByClassName('dashboard-sidebar js-sticky top-0 px-3 px-md-4 px-lg-4 overflow-auto')[0]
  if(_dashboardsidebar){
    _dashboardsidebar.style['background-color'] = '#4A5568'  
  }
  
  for(let i = 0 ; i < _para.length ; ++i){
       _para[i].innerHTML = 'Hello World!'
      //_para[i].style['background-color'] = '#2C5282'
  }
})()



