/*__________Qui - Qì United Integration  v0.1.3__________*/

var qui = {};

qui.pageURL = "";
qui.lastElements = [];

qui.getJSON = function (url, callback) {
  var xhr = new XMLHttpRequest(),
    response;
  xhr.open('GET', url, true);
  //xhr.responseType = 'json';
  xhr.onreadystatechange = function (aEvt){
    if (xhr.readyState == 2 ){ qi.show.loader("red")}
    else if (xhr.readyState == 3){ qi.show.loader("green")}
    else if (xhr.readyState == 4){
      qi.toggle.loader();
      if (xhr.status == 200)
        callback(null,JSON.parse(xhr.responseText));
      else if (xhr.status == 404)
        qi.show.snack("Página no encontrada (404):<br>"+url,"green")
      else if (xhr.status == 500)
        qi.show.snack("Error Interno del Servidor (500):<br>"+url,"yellow")
    }
    xhr.onerror = function(){
      qi.hide.loader();
      qi.show.snack("Hubo un Error Procesando la solicitud:<br>No hay conexión","red")
    }
  }
  xhr.send();
  return xhr;
};

qui.parse = function(child,tag,string,parent){
  var event=[],aTitle=[],text=[],href=[],src=[],linkId=[],aClass=[],anId=[],o,c,n=0,i=0,mem=[],el,iterate = true;
  if (tag == "page" || tag == "back"){ el = document.createElement("a"); }
  else if (tag == "id"){ child[tag] = string; iterate = false; }
  else if(tag == "snack" || tag == "modal"){ }
  else if (tag == "class"){
    if(parent){ parent.classList.add(string) }
    else { child.classList.add(string) }
    iterate = false;
  }
  else if ( tag == "comments"){ el = document.createElement("div") }
  else { el = document.createElement(tag) };
  if(iterate){
    for (var char of string){
      if(n<=3){mem[n]=char;n++;continue}
      if(mem[0]=="|"){
        if(mem[1]=="<" || mem[1]=="(" || mem[1]=="[" || mem[1]=="." || mem[1]=="#" || mem[1]==">" || mem[1]=="{" || mem[1]=="$"){
          o = mem[1];
        }
      }
      else {
        //class .:
        if(o == "."){
          if(mem[2]==":"){
            if(mem[3]=="|"){ aClass[i] = mem[1];o=mem[2];i=0; }
          }
          else { aClass[i] = mem[1];i++;}
        }
        //id #:
        if(o == "#"){
          if(mem[2]==":"){
            if(mem[3]=="|"){ anId[i] = mem[1];o = mem[2];i=0; }
          }
          else { anId[i] = mem[1];i++ }
        }
        //title $:
        if(o == "$"){
          if(mem[2]==":"){
            if(mem[3]=="|"){ aTitle[i] = mem[1];o=mem[2];i=0; }
          }
          else { aTitle[i] = mem[1];i++;}
        }
        //href, input type <>
        if(o == "<"){
          if(mem[2]==">"){
            if(mem[3]=="|"){ href[i] = mem[1];o = mem[2];i=0; }
          }
          else { href[i] = mem[1];i++ }
        }
        //linkid > :
        if(o == ">"){
          if(mem[2]==":"){
            if(mem[3]=="|"){ linkId[i] = mem[1];o = mem[2];i=0; }
          }
          else { linkId[i] = mem[1];i++ }
        }
        //event {}
        if(o == "{"){
          if(mem[2]=="}"){
            if(mem[3]=="|"){ event[i] = mem[1];o=mem[2];i=0; }
          }
          else { event[i] = mem[1];i++;}
        }
        //content, jps tag ==> []
        if(o == "["){
          if(mem[2]=="]"){
            if(mem[3]=="|"){ text[i] = mem[1];o = mem[2];i=0; }
          }
          else { text[i] = mem[1];i++; }
        }
        //src ()
        if(o == "("){
          if(mem[2]==")"){
            if(mem[3]=="|"){src[i] = mem[1];i=0;o = mem[2]}
          }
          else {src[i] = mem[1];i++}
        }
      }
      mem[0]=mem[1];mem[1]=mem[2];mem[2]=mem[3];mem[3]=char;
    }
    event = event.join("");anId = anId.join("");aClass = aClass.join("");aTitle=aTitle.join("");href = href.join("");text = text.join("");src = src.join("");linkId = linkId.join("");
  }
  //console.log(child, tag, string)
  if(el){
    if(aClass) el.classList.add(aClass);
    if(anId) el.id = anId;
    if(aTitle){ el.title = aTitle }
    else{ if(text) el.title = text }
    if(event) el.setAttribute(linkId,event)
  }
  if(tag == "p" || tag =="h1" || tag == "h2" || tag == "h3" || tag == "h4" || tag == "h5" || tag == "strong" || tag == "em" || tag == "header" || tag == "nav" || tag == "section" || tag == "footer" || tag == "li" || tag == "div" || tag == "blockquote" || tag == "figcaption" || tag == "td" || tag == "th" || tag == "caption" || tag == "label" || tag == "small"){
    el.innerHTML = string;
    child.appendChild(el);
  }
  else if(tag == "snack"){
    qi.add.snack(text,aClass);
  }
  else if(tag == "modal"){
    qi.show.modal(text,aTitle);
  }
  else if(tag == "br" || tag == "hr" || tag == "span"){
    if(aClass) el.classList.add(aClass);
    if(tag == "span"){el.innerHTML = text;}
    child.appendChild(el);
  }
  else if(tag == "input"){
    if(text) el.placeholder = text;
    if(href) el.type = href;
    child.appendChild(el);
  }
  else if(tag == "script"){
    if(src) el.src = src;
    if(event) el.innerText = event;
    child.appendChild(el);
  }
  else if(tag == "button"){
    el.classList.add("btn","btns");
    //el.href = href;
    //el.setAttribute("onclick",event);
    el.innerHTML= text;
    child.appendChild(el);
  }
  else if(tag == "a"){
    el.classList.add("links");
    //aTitle ? el.title = aTitle : el.title = text;
    if(src == "download")
      el.setAttribute("download",text)
    else
      el.target = src;
    el.href = href;
    el.innerHTML = text;
    child.appendChild(el);
  }
  else if(tag == "img"){
    el.classList.add("image");
    el.src = src;
    el.alt = text;
    aTitle ? el.title = aTitle : el.title = text;
    child.appendChild(el);
  }
  else if(tag == "bimg"){
    qi.set.background.from(linkId,src)
  }
  else if(tag == "back"){
    var linkTitle;
    el.classList.add("back-link");
    aTitle ? linkTitle = aTitle : linkTitle = text;
    el.title = aTitle;
    el.href = "javascript:;";
    el.innerHTML = text;
    (function(){
      el.setAttribute("onclick","qui.backAction();window.scrollTo(0,0);");
    }())
    child.appendChild(el);
  }
  else if(tag == "page"){
    var linkTitle;
    el.classList.add("page-link");
    aTitle ? linkTitle = aTitle : linkTitle = text;
    el.title = aTitle;
    el.href = "javascript:;";
    el.innerHTML = text;
    (function(){
      el.setAttribute("onclick","qui.createPage('"+linkId+"','"+src+"');window.scrollTo(0,0);");
    }())
    child.appendChild(el);
  }
  else if(tag == "load"){ qui.createPage(child,src) }
  else if(tag == "comments"){
    var title = document.createElement("header"),form = document.createElement("form"),name = document.createElement("input"),message = document.createElement("textarea"),submit = document.createElement("input");
    title.id = "comments-title";title.innerText = "Comentarios";
    el.id = "page-comments";
    //form.action = "write.php";
    name.classList.add("input");name.type = "text";name.placeholder = "Nombre";name.name = "name";name.required = true;
    message.classList.add("input");message.placeholder = "Mensaje (140 letras)";message.name = "said";message.required = true;message.maxLength = 140;
    submit.classList.add("btn","light-grey");submit.type = "button";submit.value="Comentar";
    submit.setAttribute("onclick","qi.php.writeJSON('write.php','"+qui.pageURL+"-comments.json',{'name':'"+name.name+"','said':'"+message.name+"'},function(response){console.log(response)})")
    form.appendChild(name);form.appendChild(message);form.appendChild(submit);
    message.insertAdjacentHTML("beforebegin","<br>");submit.insertAdjacentHTML("beforebegin","<br>");
    el.appendChild(title);el.appendChild(form);
    el.classList.add("padding");
    var url = qui.pageURL+"-comments.json";
    qi.get.object.from(url,function(comments){
      if(comments){
        for(var user of comments.data){
          var userInfo = document.createElement("p"),userName = document.createElement("span"),userDate = document.createElement("span"),userSaid = document.createElement("p"),sep = document.createElement("hr");
          userInfo.classList.add("user-info");userSaid.classList.add("user-said");userName.classList.add("user-name");userDate.classList.add("user-date");
          userName.innerText = user.name;
          userDate.innerText = user.date;
          userInfo.appendChild(userName);
          userInfo.innerHTML += " escribió el ";
          userInfo.appendChild(userDate);
          userSaid.innerText = user.said;
          el.appendChild(userInfo);
          el.appendChild(userSaid);
          userInfo.insertAdjacentHTML("beforebegin","<hr>");
          userSaid.insertAdjacentHTML("afterend","<hr>")
        }
      }
      else {
        var noComments = document.createElement("p");
        noComments.innerText = "No hay comentarios para este artículo."
        el.appendChild(noComments)
      }
    },false)
    child.appendChild(el)
  }
  else if(tag == "innerHTML" || tag == "innerText"){
    child[tag] += string;
  }
  else {
    child[tag] = string;
  }
}
qui.backAction = function(){
  var localUrls = [];var i = 0;var ii=0;
  for(var x of qui.lastElements){ localUrls[i] = x;i++;};
  localUrls.pop();
  for(var el of localUrls){
    //console.log(el);
    for(var url in el){
      //console.log(url,el[url])
      qui.createPage(url,el[url])
    }
  }
  qui.lastElements = [];
  for(var y of localUrls){qui.lastElements[ii] = y;ii++}
  
}

qui.createContent = function(parent,content){
  var newElement;
  for(var level of content){
    for(var element in level){
      //console.log(element);
      if(element[0] == "!")
      {
        newElement = document.createComment(element.replace('!',''));
        parent.appendChild(newElement);
        break;
      }
      else
      {
        newElement = document.createElement(element);
      }
      if(Array.isArray(level[element])){
        parent.appendChild(newElement);
        qui.createContent(newElement,level[element])
      }
      else{
        qui.parse(parent,element,level[element])
      }
    }
  }
}

qui.isMeta = false;
qui.style = {};
qui.createPage = function (id,json,callback) {
  qui.pageURL = json;
  json = json + ".json";
  qui.getJSON(json, function (status, elements) {
    if(status!==null) console.log("error");
    if(elements.style) qui.style = elements.style;
    //if(pageTitle){var title = document.querySelector("title");title.innerHTML=pageTitle;}
    var head = document.querySelector("head"),pageTitle = document.querySelector("title");
    for (var parent in elements) {
      if(parent == "meta"){
        for(var data in elements[parent]){
          if (data == "title") {
            if(pageTitle){
              pageTitle.innerHTML=elements[parent][data];
            }
            else {
              pageTitle = document.createElement(data);
              pageTitle.innerText = elements[parent][data];
              head.appendChild(pageTitle)  
            }
            break
          };
        }
      };
      if (parent == "meta" && !qui.isMeta) {
        for (var data in elements[parent]) {
          if (data == "charset" || data == "description" || data == "keywords" || data == "viewport" || data == "author") {
            var meta = document.createElement("meta");
            if (data == "charset") {
              meta.setAttribute(data, elements[parent][data]);
            } else {
              meta.setAttribute("name", data);
              meta.setAttribute("content", elements[parent][data])
            }
            head.appendChild(meta);
            break;
          };
          if (data == "favicon"){
            var favicon = document.createElement("link");
            favicon.rel = "icon";
            favicon.href = elements[parent][data];
            head.appendChild(favicon);
            break;
          }
        }
        qui.isMeta = true;
      }
      if (parent == "body") {
        var lastPageUrl = {};
        lastPageUrl[id]=qui.pageURL;
        qui.lastElements.push(lastPageUrl);
        //console.log(qui.lastElements);
        var body = document.querySelector(id);
        body.innerHTML="";
        qui.createContent(body,elements[parent])
      }
      if (parent == "part"){
        qui.createContent(id,elements[parent])
      }
      if (qui.style) {
        for (var selector in qui.style) {
          for (var style in qui.style[selector]) {
            var targets = document.querySelectorAll(selector);
            for (var element of targets) {
              if (style == "class") {
                for (var classes of qui.style[selector][style]) {
                  element.classList.add(classes);
                };
                continue
              }
              if (style == "css") {
                for (var css in qui.style[selector][style]) {
                  element.style[css] = qui.style[selector][style][css];
                }
              }
            }
          }
        }
      }
    }
  })
  if(callback && typeof callback == "function") callback();
};
qui.sCreatePage = function (p,i,j,callback){
  var id = document.querySelector(i);
  var j = j + ".json";
  qi.get.data.from(p+"?j="+j,function(data){ id.innerHTML = "";id.innerHTML = data; });

  if(callback && typeof callback == "function") callback();
}
