(function(){
  console.log('Bookmarlet Starting')
  let _para = document.getElementsByTagName('p') 
  let _h1 = document.getElementsByTagName('h1') 
  let _li = document.getElementsByTagName('li') 
  let _spans = document.getElementsByTagName('span')
  
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
    _mediumBody.style['background-color'] = '#2D3748' 
  }
  


  if(_para.length > 0){
    for(let i = 0 ; i < _para.length ; ++i){
      if(_para[i]){
        _para[i].style['color'] = 'white' 
      }
   }
  }
  


  if(_h1.length > 0){
    for(let j = 0 ; j < _h1.length ; ++j){
      if(_h1[j]){
        _h1[j].style['color'] = 'white' 
       }
    }
  }


  if(_li.length > 0){
    for(let k = 0 ; k < _li.length ; ++k){
      if(_li[k]){
        _li[k].style['color'] = 'white' 
       }
    }
  }


  if(_spans.length > 0){
    for(let l = 0 ; l < _spans.length ; ++l){
      if(_spans[l]){
        _spans[l].style['color'] = 'white' 
       }
    }
  }


  let _usernameInput = document.getElementsByClassName('username_input')[0]

  // function onUsernameChange() {
  //   console.log('clicked')
  //   var x = _usernameInput.value
  //   console.log('x', x)
  // }




  _usernameInput.addEventListener("change", () => {
    console.log('clicked')
    var x = _usernameInput.value
    console.log('x', x)
  })


  let btnSubmit = document.getElementsByClassName('btn-submit')[0]
  btnSubmit.addEventListener("click", () => {
    console.log('clicked')
    var x = _usernameInput.value
    console.log('x', x)
  })
})()



