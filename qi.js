/*_______________Qi version: 0.0.29_______________*/
/*_______________Developed by: Mike Inoa__________*/
var log = false;
var qi = {};

/*_______________SET_______________*/

qi.set = {};
// ANIMATION
qi.set.animation = function(selector,anim){
  var elements = qi.get.elements(selector);
  for (element of elements) {
    element.style.animation = anim;
    element.style.WebkitAnimation = anim;
  }
};
qi.set.classAnimation = function(selector,c){
  var elements = qi.get.elements(selector);
  for(element of elements){
    element.classList.remove(c);
    void element.offsetWidth;
    element.classList.add(c)
  }
}
// ATTRIBUTE
qi.set.attribute = function(selector,attribute,value){
  var i,elements;
  elements = qi.get.elements(selector);
  for (i = 0; i < elements.length; i++){
    elements[i].setAttribute(attribute,value);
  };
};
// BACKGROUND
qi.set.background = function(selector,src,rep,att,pos,siz,ori,cli,col){
  var element, elements = qi.get.elements(selector);
  if(typeof src != "string"){ qi.add.snack('Error','red') }
  for (element of elements) {
    element.style.backgroundImage = "url('" + src + "')";
    if(col){element.style.backgroundColor = col};
    if(cli){element.style.backgroundClip = cli};
    if(ori){element.style.backgroundOrigin = ori};
    if(siz){element.style.backgroundSize = siz};
    if(pos){element.style.backgroundPosition = pos};
    if(att){element.style.backgroundAttachment = att};
    if(rep){element.style.backgroundRepeat = rep};
  }
};
qi.set.background.from = function (selector,src,rep,att,pos,siz,ori,cli,col){
  qi.get.dataURL.from(src, function(data){
    qi.set.background(selector,data,rep,att,pos,siz,ori,cli,col);
  })
};
// CONTENT
qi.set.content = function(selector,value){
  var i,elements;
  elements = qi.get.elements(selector);
  for (i of elements){ i.innerHTML =  value; }
};
// FAVICON
qi.set.favicon = function(file){
      var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = file;
      document.getElementsByTagName('head')[0].appendChild(link);
};
qi.set.favicon.from = function (url){
  qi.get.dataURL.from(url,function(data){
    if (data == "404"){ qi.show.snack('Favicon not found','red') }
    else { qi.set.favicon(data) }
  });
}
qi.set.focus = function(selector){
  var element, elements = qi.get.elements();
  for(element of elements){
    element.focus()
  }
}
// TABS
qi.set.tabs = function(){};
// THEME
qi.set.theme = function(uno,dos,callback){
  var theme, themes = dos ? [uno,dos] : [uno];
  for (theme of themes) {
    if (callback){ qi.get.object.from(theme,function(obj){ qi.add.theme(obj,callback) }) }
    else { qi.get.object.from(themes,function(obj){ qi.add.theme(obj) }) };
  }
};
// SCROLL
qi.set.scrollTo = function(selectorX,selectorY){
  if(typeof selectorX=="string"){
    var element, elements = qi.get.elements(selectorX);
    for(element of elements){
      element.scrollIntoView();
    }
  }
  else if(typeof selectorX == "number"){
    if(selectorY){ window.scrollTo(selectorX, selectorY) } else { window.scrollTo(selectorX) };
  }
};
// STYLE
qi.set.style = function(selector,value){
  var elements = qi.get.elements(selector);
  for (var i of elements){
    qi.set.attribute(i,"style",value);
  }
};
qi.set.rightClickOff = function(){
  //Disable right mouse click Script
  //By Maximus (maximus@nsimail.com) w/ mods by DynamicDrive
  //For full source code, visit http://www.dynamicdrive.com

  function clickIE4(){
    if (event.button==2){
      qi.add.snack("Right Click Disable");
      return false;
    }
  }

  function clickNS4(e){
    if (document.layers||document.getElementById&&!document.all){
      if (e.which==2||e.which==3){
        qi.add.snack("Right Click Disable");
        return false;
      }
    }
  }

  if (document.layers){
    document.captureEvents(Event.MOUSEDOWN);
    document.onmousedown=clickNS4;
  }
  else if (document.all&&!document.getElementById){
    document.onmousedown=clickIE4;
  }

  document.oncontextmenu=new Function("qi.add.snack('Right Click disabled','red');return false")

}

/*_______________GET_______________*/

qi.get = {};
qi.get.attribute = function(selector,attribute,callback){
  var value = [],n = 0, elements = qi.get.elements(selector);
  for (var element of elements){
    value[n] = element.getAttribute(attribute);
    n += 1;
  }
  if (callback && typeof callback == "function"){ callback(value);return };
  return value;
};
qi.get.bookshelf = function(shelf,selector,type,name){
  var authors = 0, books = 0, response, shelf;
  if(typeof shelf != "object"){ response = "<span class='red'>Bookshelf is not an object</a>";}
  else {
  for (var author in shelf) {
    authors += 1;
    for (var book in shelf[author]["lib"]) {
      books += 1;
    }
  };
  if (type == "author"){
    if (selector == "*" && name == "name"){
      var n = 0, response = [];
      for (var i in shelf){
        response[n] = i;
        n += 1;
      };
    }
    else if (selector == "*" && name == "number"){ response = authors }
    else if (selector == "url" || "bio"){ response = shelf[name][selector] }
  }
  else if (type == "book"){
    if (selector == "*" && name == "number"){ response = books }
    else if (selector == "des" || "url" || "cub" || "dom" || "gen" || "sub"){
      for (i in shelf){
        for (ii in shelf[i].lib){
          if (shelf[i].lib[ii] == shelf[i].lib[name]){
            response = shelf[i].lib[ii][selector];
          }
        };
      }
    }
  }
  else { response = "<span class='red'>Error getting the data</a>"; };
  }
  return response;
};
qi.get.bookshelf.from = function(url,selector,type,name,callback){
  qi.xhr(url,function(){
    if (this.readyState == 4 && this.status == 200){
      var response = JSON.parse(this.responseText);
      callback(qi.get.bookshelf(response,selector,type,name));
    }
    else if (typeof this.responseText != "object"){ callback("<span class='red'>Bookshelf not found</a>"); }
  });
}
qi.get.content = function(selector,callback){
  var value = [],n = 0, elements = qi.get.elements(selector);
  for (element of elements){
    value[n] = element.innerHTML;n += 1;
  }
  if (callback && typeof callback == "function"){ callback(value) };
  return value
};
qi.get.db = function(db,key){
  var value,i,ii,iii;
  console.log("Searching for " + key);
  for (i in db){
    console.log("i: "+i);
    if (i == key){ value = db[i];return value }
    else {
      for (ii in db[i]){
        console.log("  ii: "+ii) 
        if (ii == key){ value = db[i][ii];return value }
        else {
          for (iii in db[i][ii]){
            console.log("    iii: "+iii)
            if (iii == key){ value = db[i][ii][iii];return value }
            else { value="not found" };
          }
        }
      }
    }
  }
  return value;
}
qi.get.db.from = function(url,key,callback){
  qi.xhr(url,function(){
    if(this.readyState == 4 && this.status == 200){
      var response = JSON.parse(this.responseText);
      if (callback && typeof callback=="function"){ callback(qi.get.db(response,key)) }
    }
  });
}
qi.get.elements = function(selector){
  if (typeof selector == "object") { return [selector]; }
  else { return document.querySelectorAll(selector); }
};
qi.get.snack = false;
qi.xhr = function (target, readyfunc, xml, method, sync) {
  var httpObj;
  if (!method) {method = "GET"; }
  if (window.XMLHttpRequest) {
    httpObj = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    httpObj = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (httpObj) {
    if (readyfunc) { httpObj.onreadystatechange = readyfunc; }
    httpObj.open(method, target, sync);
    httpObj.send(xml);
  }
};
qi.get.data = {};
qi.get.data.from = function (file, func) {
  qi.xhr(file, function () {
    if (this.readyState == 4 && this.status == 200) {
      func(this.responseText);qi.get.data.used = this.responseText;
    }
  });
};
qi.get.dataURL = {};
qi.get.dataURL.from = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      if (xhr.status == 404) { callback(xhr.status) }
      else { callback(reader.result);qi.get.dataURL.used = reader.resut; }
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
};
qi.get.key = function(touch,callback){
  var stroke = touch.which || touch.keyCode;
  if(callback && typeof callback == "function"){ callback(stroke); }
  else { return stroke }
}
qi.get.object = function(obj){ return JSON.parse(obj); };
qi.get.object.from = function (file, func, sync) {
  qi.xhr(file, function () {
    console.log(file,this.status)
    if (this.readyState == 4 ){
      if (this.statusText == "OK"){ func(JSON.parse(this.responseText));qi.get.object.used = JSON.parse(this.responseText) }
      else { func(false) }
    }
    this.onerror = function(e){qi.show.modal("Error cargando la página " + file,"ERROR");func(false)}
  },sync);
};

/*_______________SEND______________*/

qi.send = {};
qi.send.object = function(obj){ return JSON.parse(obj) };
qi.send.object.to = function (url,json,name,func){
  if(!name) name = "object";
  var xmlhttp,
  object = JSON.stringify(json);
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(func)
        func(this.responseText)
      else
        return this.responseText
    }
  };
  xmlhttp.open("POST", url, true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("?json=" + object + "&name=" + name);
}

/*_______________ADD_______________*/

qi.add = {};
qi.add.attribute = function(selector,attribute,value){
  var i,elements,eval;
  elements = qi.get.elements(selector);
  for (i = 0; i < elements.length; i++){
    eval = elements[i].getAttribute(attribute);
    if (!eval){ elements[i].setAttribute(attribute,value); }
  };
};
qi.add.bookshelf = function(database,callback){
  var authors = 0,books = 0,author,book,dataGet,database;

  var els = qi.get.elements(".bookshelf");
  for (n in database) {
    authors += 1;
    for (m in database[n]["lib"]) {
      books += 1;
    }
  };
  for (var i = 0; i < els.length; i++) {
    author = els[i].getAttribute("data-author"), book = els[i].getAttribute("data-book"), dataGet = els[i].getAttribute("data-get");
    if ( dataGet == "aut" ){
      for (ii in database) {
        qi.add.content(els[i],"<li>"+ ii +"</li>");
      }
    }
    else if ( dataGet == "books" ){
      for (ii in database) {
        for (iii in database[ii].lib){
          qi.add.content(els[i],"<li>" + iii + "</li>");
        }
      }
    }
    else if (dataGet == "books-card"){
      if (author){
        qi.add.content(els[i],"<article><h4 class='books-author'>Todos los libros de " + author + "</h4></article>");
        for (ii in database[author].lib){
          qi.add.content(els[i],"<article class='book-card'><img class='book-cover' src='" + database[author]["lib"][ii].cub + "'><h4 class='book-title'>" + ii + "</h4><a class='author-link' href='" + database[author].url + "'><div class='book-author'>" + author + "</div></a><div class='book-genre'><b>Género</b>:" + database[author]["lib"][ii].gen + "</div><div class='book-sub'><b>Subgénero</b>:" + database[author]["lib"][ii].sub + "</div><div class='book-domain'><b>Dominio</b>:" + database[author]["lib"][ii].dom + "</div><div class='book-description'>" + database[author]["lib"][ii].des +"</div><hr/><div class='book-link'><a href='" + database[author]["lib"][ii].url + "'>Leer</a></div></article>")
        }
      }
      else {
        qi.add.content(els[i],"<article><h4 class='books-all'>Todos los libros en Nuestros Estantes</h4></article>");
        for (ii in database){
          for (iii in database[ii].lib){
            qi.add.content(els[i],"<article class='book-card'><img class='book-cover' src='" + database[ii]["lib"][iii].cub + "'><h4 class='book-title'>" + iii + "</h4><a class='author-link' href='" + database[ii].url + "'><div class='book-author'>" + ii + "</div></a><div class='book-genre'><b>Género</b>:" + database[ii]["lib"][iii].gen + "</div><div class='book-sub'><b>Subgénero</b>:" + database[ii]["lib"][iii].sub + "</div><div class='book-domain'><b>Dominio</b>:" + database[ii]["lib"][iii].dom + "</div><div class='book-description'>" + database[ii]["lib"][iii].des +"</div><hr/><div class='book-link'><a href='" + database[ii]["lib"][iii].url + "'>Leer</a></div></article>")
          }
        }
      }
    }
    else if (dataGet == "n-authors"){ qi.add.content(els[i],authors) }
    else if (dataGet == "n-books"){ qi.add.content(els[i],books) }
    else if (dataGet == "cub" ){ qi.add.attribute(els[i],"src",database[author]["lib"][book][dataGet]) }
    else if (dataGet == "url" ){ qi.add.attribute(els[i],"href",database[author]["lib"][book][dataGet]) }
    else if (dataGet == "bio" && author){ qi.add.content(els[i],database[author][dataGet]) }
    else if (dataGet == "des" || "dom" || "gen" || "sub" ){ qi.add.content(els[i],database[author]["lib"][book][dataGet]) }
    else { qi.add.content( els[i],"<span class='red'>Error adding Book Info.</span>") };
  }
  if(callback && typeof callback == "function"){ callback() };
};
qi.add.bookshelf.from = function(url,callback){
  qi.get.object.from(url,function(obj){
    if(callback){ qi.add.bookshelf(obj,callback) }
    else { if(typeof obj == "object"){ qi.add.bookshelf(obj) } else { qi.add.snack('Bookshelf not found','red') } };
  })
}
qi.add.class = function(selector,value){
  var element, elements = qi.get.elements(selector);
  for (element of elements){
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = value.split(" ");
    for (i = 0; i < arr2.length; i++) {
      if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
    }
  };
};
qi.add.content = function(selector,value){
  var element,elements = qi.get.elements(selector);
  for (element of elements){ element.innerHTML += " " + value; }
};
qi.add.element = function(selector,tag,value){
  var element,elements = qi.get.elements(selector), node = document.createElement(tag);
  if(value){ node.innerHTML = value; };
  for (element of elements) {
    element.appendChild(node);
  }
  return node;
};
qi.add.html = function(){};
qi.add.meta = function(name,content){
  var meta = document.createElement('meta');
  meta.name = name;
  meta.content = content;
  document.getElementsByTagName('head')[0].appendChild(meta);
};
qi.add.slideshow = function(){};
qi.add.snack = function(text,style){
  while (!qi.get.snack){ qi.show.snack(text,style) }
};
qi.add.theme = function(theme,callback){
  for (i in theme) {
    //ANIMATIONS [type,selector,animation,color]
    theme[i][0]=="animation" ? qi.set.animation(theme[i][1],theme[i][2],theme[i][3]):
    //FAVICON    [type,url]
    theme[i][0]=="favicon" ? qi.set.favicon(theme[i][1]):
    //BACK IMAGE [type,selector,url,(repeat,attachment),(position,size),(origin,clip),color]
    theme[i][0]=="background" ? qi.set.background(theme[i][1],theme[i][2],theme[i][3],theme[i][4],theme[i][5],theme[i][6],theme[i][7],theme[i][8],theme[i][9]):
    //METADATOS  [type,name,content]
    theme[i][0]=="meta" ? qi.add.meta(theme[i][1],theme[i][2]):
    //ATTRIBUTES [type,selector,attribute,value]
    theme[i][0]=="attribute" ? qi.add.attribute(theme[i][1],theme[i][2],theme[i][3]):
    //EVENTS     [type,selector,event,value]
    theme[i][0]=="event" ? qi.add.event(theme[i][1],theme[i][2],theme[i][3]):
    //CONTENT    [type,selector,content]
    theme[i][0]=="insert" ? qi.set.content(theme[i][1],theme[i][2]):
    //APPEND     [type,selector,html]
    theme[i][0]=="append" ? qi.add.content(theme[i][1],theme[i][2]):
    //ELEMENT    [type,element,content]
    theme[i][0]=="element" ? qi.add.element(theme[i][1],theme[i][2],theme[i][3]):
    //ALL        [type,selector,class,attribute,value,content]
    theme[i][0]=="all" ? (
      theme[i][5]!=undefined ? qi.add.content(theme[i][1],theme[i][5]):console.log(),
      theme[i][3]!=undefined ? qi.add.attribute(theme[i][1],theme[i][3],theme[i][4]):console.log(),
      theme[i][2]!=undefined ? qi.add.class(theme[i][1],theme[i][2]):console.log()
    ):
    //CLASS [selector,class]
    qi.add.class(theme[i][0],theme[i][1]);
  };
  if(callback && typeof callback == "function"){ callback() };
};
qi.add.theme.from = function (url,callback){
  qi.get.object.from(url,function(obj){
    if(callback){ qi.add.theme(obj,callback) }
    else { qi.add.theme(obj) }
  })
};

/*_______________DEL_______________*/

qi.del = {};
qi.del.attribute = function(selector,attribute){
  var element,elements,eval;
  elements = qi.get.elements(selector);
  for (element of elements){
    eval = element.getAttribute(attribute);
    if (eval){ element.removeAttribute(attribute); }
    else { qi.add.snack('Attribute not found!','red') }
  };
};
qi.del.background = function(selector){
  var element, elements = qi.get.elements(selector);
  for(element of elements){
    if (element.style.backgroundImage != "" || undefined){ element.style.background = ""; }
    else { qi.add.snack('The element has no background','red') };
  }
};
qi.del.class = function(selector,value){
  var element, elements = qi.get.elements(selector);
  for (element of elements){
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = value.split(" ");
    for (i = 0; i < arr2.length; i++) {
      while (arr1.indexOf(arr2[i]) > -1) {
        arr1.splice(arr1.indexOf(arr2[i]), 1);     
      }
    }
    element.className = arr1.join(" ");
  };
};
qi.del.content = function(selector){
  var element, elements = qi.get.elements(selector);
  for (element of elements){
    element.innerHTML = "";
  }
};
qi.del.element = function(from,selector){
  var dad,kid,dads = qi.get.elements(from), kids = qi.get.elements(selector);
  for (dad of dads){ for (kid of kids) { dad.removeChild(kid); } }
};

/*_______________SHOW_______________*/

qi.show = function(selector){
  var elements = qi.get.elements(selector);
  for (var i of elements){
    qi.set.style(i,"display:block");
  }
};
qi.show.dropdown = function(selector){
  
};
qi.show.modal = function(inner,header,footer,timer){
  var element = qi.add.element("body","div");
  qi.add.class(element,"move fadeIn modal");
  var content = qi.add.element(element,"div");
  var inside = document.createElement("div");
  var base = document.createElement("footer");
  qi.add.class(content,"modal-content");
  qi.set.animation(content,"fadeInUp 0.5s");
  if (header) { 
    qi.add.content(content,"<div class='large center padding border-bottom' id='header-modal'>" + header + "</div>");
  }
  if(typeof inner == "object")
    inside.appendChild(inner);
  else
    inside.innerHTML = inner;
  inside.classList.add("padding","justify")
  content.appendChild(inside);
  if (footer) { base.id="footer-modal";base.classList.add("padding");base.appendChild(footer);content.appendChild(base) }
  qi.add.attribute(element,"onclick","qi.hide.modal()")
  qi.show(element);
  if(timer){
    setTimeout(function(){ qi.hide.modal() },timer*1000)
  }
};
qi.show.scroll = function(){};
qi.show.sidebar = function(){};
qi.show.snack = function(text,style){
  if (!qi.get.snack){
    qi.get.snack = true;
    var element = qi.add.element("body","div",text);
    qi.add.class(element,"snack show");
    if (style){ qi.add.class(element,style) };
    element.style.visibility = "visible";
    element.style.animation = "fadeInUp 0.5s,fadeOutDown 0.5s 2.5s";
    setTimeout(function(){ qi.del.element("body",".snack"); qi.get.snack = false; }, 3000);
  }
};
qi.show.loader = function(color){
  var load = document.createElement("div"),
  loading = document.querySelector(".loading");
  if (loading){ 
    loading.removeAttribute("class");
    qi.add.class(loading,"loading border-top border-xlarge border-top-"+color+" border-bottom-"+color) 
  }
  else {
    load.style.animation = "fadeInUp 0.2s,spin 0.4s linear infinite 0.2s";
    qi.add.class(load,"loading border-top border-xlarge border-top-"+color+" border-bottom-"+color);
    load.style.visibility = "visible";
    document.body.appendChild(load);
  }
}
qi.show.tab = function(){};

/*_______________HIDE_______________*/

qi.hide = function(selector){
  var elements = qi.get.elements(selector);
  for (var i of elements){
    qi.set.style(i,"display:none")
  }
};
qi.hide.modal = function(){ qi.set.animation('.modal-content','fadeOutDown 0.5s');qi.set.animation('.modal','fadeOut 0.5s');setTimeout(function(){ qi.del.element("body",'.modal') },500) };
qi.hide.sidebar = function(){};
qi.hide.loader = function(){
  var load = document.querySelector(".loading");
  load.style.animation = "fadeOutDown 0.2s";
  setTimeout(function(){ qi.del.element("body",".loading");}, 100);
}

/*_______________TOGGLE_______________*/

qi.toggle = {};
qi.toggle.class = function(){};
qi.toggle.show = function (selector) {
  var element, elements = qi.get.elements(selector);
  for(element of elements){
    if (element.style.display == "none"){ qi.show(element) }
    else { qi.hide(element) };
  }
};
qi.toggle.loader = function(color){
  if (!color){color = "red"};
  var loading = document.querySelector(".loading");
  if(loading){
    loading.style.animation = "fadeOutDown 0.2s";
    setTimeout(function(){ qi.del.element("body",".loading");}, 100);
  }
  else {
    var load = document.createElement("div");
    load.style.animation = "fadeInUp 0.2s,spin 0.4s linear infinite 0.2s";
    qi.add.class(load,"loading border-top border-xlarge border-top-" + color +" border-bottom-"+color);
    load.style.visibility = "visible";
    document.body.appendChild(load);
  }
}
/*__________FILESYSTEM ADD__________*/
qi.add.fs = function(php,filename,text){
  var url = php + "?filename=" + filename + "&text=" + text;
  qi.get.data.from(url, function (response) {
    console.log(url,response);
    qi.show.snack(response,"green")
  });
};
qi.php = {}; qi.js = {};
qi.php.writeJSON = function(php,name,content,func){
  var xml = "?name=" + name + "&content=" + content;
  qi.xhr(php,function(){
    if(this.readyState == 4 && this.status == 200){
      if(func && typeof func == "function")
        func(this.responseText)
      else
        return this.responseText
    }
  },xml,"POST")
}
qi.set.highlightingOff = function(){
  //courtesy of BoogieJack.com
  function killCopy(e){ return false }
  function reEnable(){ return true }

  document.onselectstart=new Function ("return false")
  if (window.sidebar){
    document.onmousedown=killCopy
    document.onclick=reEnable
  }
}