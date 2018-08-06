/* Qif - Qi Interactive Fiction V0.1.8 */

qif = {};

qif.getJSON = function(url, callback) {
  var xhr = new XMLHttpRequest(),response;
  xhr.open('GET', url, true);
  //xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, JSON.parse(xhr.response));
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

qif.checkpoint = {};
qif.timer = {"on":false};
qif.data = {};
qif.items = {};
qif.meta = {"read":false};
qif.audio = false;
qif.timer.hours = 0;
qif.achievements = [];
qif.tts = false;
qif.texts = "";
qif.style = {
  "custom":false,
  "mainFont":"sans",
  "mainFontSize":"normal",
  "mainAlign":"justify",
  "mainTextColor":"text-black",
  "mainBackgroundColor":"white",
  "mainShadowType":"card",
  "choiceText":"normal",
  "choiceWidth":"300px",
  "choiceBackgroundColor":"white",
  "choiceBackgroundHoverColor":"hover-lime",
  "choiceLinkColor":"text-safety-blue",
  "choiceLinkHoverColor":"hover-text-safety-red",
  "checkpointSnackColor":"yellow",
  "storedSnackColor":"blue",
  "hpBarContainer":"red",
  "hpBar":"green",
  "inventoryButtonColor":"orange",
  "inventoryItemColor":"light-grey",
  "inventoryTextBackgroundColor":"light-grey",
  "inventoryBackgroundColor":"white",
  "inventoryHeaderBackgroundColor":"white",
  "inventoryHeaderTextColor":"text-black",
  "inventoryLifeContainerColor":"red",
  "inventoryLifeBarColor":"green",
  "achievementSnackColor":"green",
  "errorSnackColor":"red"
};

qif.action = function(path,id){
  if (!qif.audio) {
    var audioBgm = document.createElement("audio");
    document.querySelector("body").appendChild(audioBgm);
    qif.audio = true;
  }
  !id ? id = "start" : console.log("-------------------\ngoing to => " + path + ": " + id);
  qif.timer.minutes = new Date().getMinutes();
  if(!qif.timer.on){ qif.timer.one = qif.timer.minutes; qif.timer.on = true; };
  if(qif.timer.one > qif.timer.minutes) {
    qif.timer.current = 60-qif.timer.one;
    qif.timer.current += qif.timer.minutes;
  } else {
    if(qif.timer.current == 59){ qif.timer.hours =+ 1 };
    qif.timer.current = qif.timer.minutes - qif.timer.one;
  }
  
  qif.getJSON("js/"+path+".json",function(err,script){
    var story = script.story,
    meta = script.meta,
    styles = script.style;
    found=false,
    container = document.getElementById("qif-container"),
    line = document.getElementById("qif"),
    inventory = document.createElement("button"),
    div = document.createElement("div");
    inventory.id = "inventory";
    if(meta && !qif.meta.read){
      var doc = document.querySelector("#qif-title"),head = document.querySelector("head"),viewport = document.createElement("meta")
      console.log("Metadata:\n");
      viewport.name = "viewport";viewport.content = "width=device-width,initial-scale=1.0";
      head.appendChild(viewport);
      for (var data in meta){
        var metaElement = document.createElement("meta");
        qif.meta[data] = meta[data];
        if (data == "title"){
          doc.classList.add("padding","center","xlarge","margin-bottom");
          doc.insertAdjacentHTML("beforeend",meta[data]);
          if(document.querySelector("title")){
            document.querySelector("title").innerHTML = meta[data];
          }
          else {
            var metaPageTitle = document.createElement("title");
            metaPageTitle.innerText = meta[data];
            head.appendChild(metaPageTitle)
          }
        }
        else if (data=="author" || data=="description"){
          metaElement.name = data;
          metaElement.content = meta[data];
        }
        head.appendChild(metaElement)
        console.log("# "+data + " => " + qif.meta[data])
      }
      qif.meta.read = true;
    }
    if(qif.data.hp != undefined) var currentLife = (qif.data.hp.value*100)/qif.data.hp.max;
    if(id == "start"){
      console.log("Custom Style(s):\n");
      container.removeAttribute("class");
      line.removeAttribute("class");
      div.style.width = "";
      //line.classList.remove(qif.style.mainFont,qif.style.mainTextColor,qif.style.mainAlign);
      for(var customStyle in styles){
        qif.style[customStyle] = styles[customStyle];
        console.log("{ "+ customStyle + " => " + styles[customStyle] + " }");
      }
      if(qif.style.mainClass != undefined){
        if(qif.style.mainClass == "m1" || "m2" || "m3" || "m4" || "m5" || "m6" || "m7" || "m8" || "m9" || "m10" || "m11" || "m12"){ container.classList.add("col",qif.style.mainClass) }
      } 
      if(qif.style.mainWidth) container.style.width = qif.style.mainWidth;
    }
    //INVENTORY
    if(!document.querySelector("#inventory")){
      var items = document.createElement("div");
      inventory.classList.add("btn",qif.style.inventoryButtonColor,"bottom-right","padding");
      inventory.innerText = "Items";inventory.title = "Inventory";
      inventory.onclick = function(){
        items.innerHTML = "";
        //LIFE BAR
        if(qif.data.hp != undefined && qif.data.hp.value > 0){
          var currentLife = (qif.data.hp.value*100)/qif.data.hp.max;
          var lifeContainer = document.createElement("div");lifeContainer.classList.add(qif.style.inventoryLifeContainerColor,"round-large");
          var life = document.createElement("div");life.classList.add(qif.style.inventoryLifeBarColor,"center","small","round-large");
          life.innerText = "HP: " + qif.data.hp.value;
          life.style.width = currentLife+"%";
          lifeContainer.appendChild(life);
        }
        else {lifeContainer = document.createElement("hr")}
        //ITEMS
        for(var i in qif.items){
          if(qif.items[i].value){
            var itemContainer = document.createElement("div");
            itemContainer.classList.add("col","s4","section");
            items.classList.add("row-padding");
            var itemPreview = qif.items[i].preview ? document.createElement("img") : document.createElement("button");
            if (qif.items[i].preview){
              var itemName = document.createElement("p");
              itemPreview.src = "images/"+qif.items[i].preview;
              itemPreview.style.width = "140px";itemPreview.style.height = "140px";
              itemPreview.classList.add("image","center-block");
              itemName.classList.add("container","center",qif.style.mainFontSize,qif.style.inventoryTextBackgroundColor);
              itemName.innerText = i; 
              if (typeof qif.items[i].value == "number") itemName.innerText += " x" + qif.items[i].value;
              itemContainer.appendChild(itemPreview);
              itemContainer.appendChild(itemName);
            }
            else {
              itemPreview.classList.add(qif.style.inventoryItemColor,"btn","bar");
              itemPreview.innerText = i;
              if (typeof qif.items[i].value == "number") itemPreview.innerText += " x" + qif.items[i].value;
              itemContainer.appendChild(itemPreview);
            }
            items.appendChild(itemContainer);
          } else if (qif.items == "") { 
            items.innerText = "Empty / Vacío"
          }
        }
        qi.show.modal(items,"Inventory",lifeContainer);
        document.querySelector(".modal-content").classList.add(qif.style.inventoryBackgroundColor);
        document.querySelector("#header-modal").classList.add(qif.style.inventoryHeaderBackgroundColor,qif.style.inventoryHeaderTextColor);
        //document.querySelector("#footer-modal").classList.add("black");
      };
      document.body.appendChild(inventory)
    }
    //HP BAR
    if(document.querySelector("#hp-Bar-Container")) qi.del.element("body","#hp-Bar-Container");
    if(qif.data.hp != undefined){
      var hpBarContainer = document.createElement("div"), hpBar = document.createElement("div");
      hpBarContainer.id = "hp-Bar-Container";
      hpBarContainer.style.width = "250px";
      hpBarContainer.classList.add("bottom-left","shadow",qif.style.hpBarContainer);
      hpBar.classList.add(qif.style.hpBar);
      /*if(qif.data.hp > 1)
        hpBar.innerText = "HP: " + qif.data.hp;
      else*/
      hpBar.innerHTML = "&nbsp;"; 
      hpBar.style.width = currentLife+"%";
      hpBarContainer.appendChild(hpBar);
      document.body.appendChild(hpBarContainer);
    }
    container.classList.add("section","center-block",qif.style.mainBackgroundColor,qif.style.mainShadowType);
    line.classList.add("container",qif.style.mainFont,qif.style.mainTextColor,qif.style.mainAlign,qif.style.mainFontSize);
    div.style.width = qif.style.choiceWidth;
    div.classList.add("center-block","center","move","fadeIn",qif.style.choiceText);
    for(var section in story){
      if(section == id){
        found = true;
        for(var element of story[section]){
          //CHECKPOINT
          if(element.checkpoint){
            qif.checkpoint = {};qif.checkpoint.data = {};qif.checkpoint.items = {};qif.checkpoint.achievements = [];
            qif.checkpoint.source = path;
            qif.checkpoint.id = id;
            for(var datos in qif.data){
              qif.checkpoint.data[datos] = {};
              for(var values in qif.data[datos]){
                qif.checkpoint.data[datos][values] = qif.data[datos][values];
              }
            }
            for(var objeto in qif.items){
              qif.checkpoint.items[objeto] = {}
              for(var values in qif.items[objeto]){
                qif.checkpoint.items[objeto][values] = qif.items[objeto][values]
              }
            }
            for(var logro of qif.achievements){
              qif.checkpoint.achievements[logro] = qif.achievements[logro]
            }
            console.log("Checkpoint in => " + id)
            qi.show.snack("&ofcir; CHECKPOINT &ofcir;",qif.style.checkpointSnackColor)
          }
          //TEXT
          else if(element.txt){
            var txt = document.createElement("p");
            txt.classList.add("move","fadeIn");
            txt.innerHTML = element.txt;
            qif.texts += txt.innerText;
            line.appendChild(txt);
          }
          //TITLE
          else if (element.title){
            var title = document.createElement("h3"), pageTitle = document.querySelector("title");
            title.classList.add("center","move","fadeIn");
            title.innerHTML = element.title + "<hr>";
            if(pageTitle){
              pageTitle.innerText = "";
              pageTitle.innerText += qif.meta.title + ": " + element.title;
            }
            else{
              pageTitle.innerText = element.title;
            }
            line.appendChild(title);
          }
          //SUBTITLE
          else if (element.subtitle){
            var subtitle = document.createElement("h5"),pageTitle = document.querySelector("title");
            subtitle.classList.add("center","move","fadeIn");
            subtitle.innerHTML = element.subtitle;
            pageTitle.innerText += " - " + element.subtitle;
            line.appendChild(subtitle);
          }
          //IMAGES
          else if (element.img) {
            var image = document.createElement("img"), data = element.img;
            image.classList.add("image","shadow","move","fadeIn");
            for (var value in data){
              if (value == "source"){ image.src = "images/" + data[value] };
              if (value == "alt"){ image.alt = data[value] }
            };
            if(data.float == "left"){
              image.classList.add("left","margin-bottom","margin-top","margin-right");
              image.style.width = "200px"
            }
            else if (data.float == "right"){
              image.classList.add("right","margin-bottom","margin-top","margin-left");
              image.style.width = "200px"
            }
            else {
              image.classList.add("center-block");
              image.style.width = "400px"
            }
            line.appendChild(image);
          }
          //CHOICES
          else if (element.choice){
            //var div = document.createElement("div"),
            var choices=element.choice,label,link,anchor,source;
            for(var j = 0; j < choices.length;j++){
              var ifChoice = false;
              anchor = document.createElement('a');
              for (var choice in choices[j]){
                var value = choices[j][choice];
                if (choice == "label"){
                  label = value;
                  anchor.innerHTML = "«" + label + "»";
                }
                else if (choice == "source"){
                  source = value;
                }
                else if (choice == "link"){
                  link = value;
                  if (!source){ source = path };
                  (function(link,source){
                    anchor.onclick= function(){
                      qi.set.scrollTo(this);
                      line.removeChild(div);
                      qif.action(source,link);
                    }
                  }(link,source))
                }
                else {
                  //if(qif.data[choice] != undefined) console.log("Data value: "+qif.data[choice]+" => if choice: "+value);
                  //if(qif.items[choice] != undefined) console.log("Item value: "+qif.items[choice]+" => if choice: "+value);
                  if (qif.data[choice] != undefined && qif.data[choice].value != value){ ifChoice = true; break; }
                  else if (qif.items[choice] != undefined && qif.items[choice].value != value){ ifChoice = true; break};
                }
              }
              anchor.href = "javascript:;"
              anchor.removeAttribute("class");
              anchor.classList.add("shadow-text","no-decoration",qif.style.choiceLinkColor,qif.style.choiceLinkHoverColor);
              if (!ifChoice){ 
                div.insertAdjacentHTML("beforeend","<hr>");
                div.appendChild(anchor); 
                div.insertAdjacentHTML("beforeend","<hr>");
              }
            }
            line.appendChild(div);
            break; 
          }
          //SOUND & BGM
          else if (element.sound){
            var snd = new Audio(),
            sound = element.sound;
            snd.src = "sound/" + sound.source;
            snd.volume = sound.volume ? sound.volume/100 : 1;
            snd.loop = sound.loop ? true : false;
            snd.play();
            console.log("> Playing sound => " + sound.source)
          }
          else if (element.bgm){
            var data = element.bgm;
            var delay = data.delay ? data.delay : 0;
            var bgm = document.querySelector("audio");
            if (data.source) bgm.src = "sound/" + data.source;
            bgm.volume = data.volume ? data.volume/100 : 1; 
            bgm.loop = data.loop ? true : false;
            setTimeout(function(){
              bgm.pause();
              if (data.stop) {
                bgm.pause();
                console.log("> Stoping bgm")
              }
              else {
                bgm.play();
                console.log("> Playing bgm => " + data.source + " with a delay of: " + delay + "s and volume at " + bgm.volume*100  +"%");
              }
            },delay*1000)
          }
          //PUZZLES
          else if (element.puzzle){
            var input = document.createElement("input"),
            puzzle = element.puzzle,
            keys = function(pressed,value){
              var x = pressed.key;
              if (x == "Enter"){
                line.removeChild(input);
                for(var condition of puzzle){
                  var next = condition.source ? condition.source : path;
                  if(condition.if == value){
                    qif.action(next,condition.link);
                    break
                  };
                  if (condition.if == "else"){
                    if (condition.link == "self")
                      { qif.action(next,value)}
                    else 
                      { qif.action(next,condition.link); }
                    break
                  }
                }
              }
            };
            input.style.width = "300px";
            input.type = "input";
            input.removeAttribute("class");
            input.classList.add("input","center-block","section");
            (function(puzzle){
              input.onkeyup = function(event){
                keys(event,this.value);
              }
            }(puzzle));
            line.appendChild(input);
          }
          //ROLL DICE
          else if (element.roll){
            var roll = element.roll, value = Math.floor((Math.random() * 6) + 1),anchor = document.createElement("a");
            console.log("/ Roll number => " + value);
            for (var condition of roll){
              var cif = condition.if,
              bif = condition["if>"],
              lif = condition["if<"],
              link = condition.link,
              label = condition.label,
              next = condition.source ? condition.source : path;
              if (label){  anchor.innerHTML = label; }
              if (cif == value){
                (function(link){
                  anchor.onclick= function(){
                    line.removeChild(div);
                    qif.action(next,link);
                  }
                }(link))
                break;
              };
              if (value > bif){
                console.log(value + " > " + bif);
                (function(link){
                  anchor.onclick= function(){
                    line.removeChild(div);
                    qif.action(next,link);
                  }
                }(link))
                break;
              };
              if (value < lif){
                console.log(value + " < " + lif);
                (function(link){
                  anchor.onclick= function(){
                    line.removeChild(div);
                    qif.action(next,link);
                  }
                }(link))
                break;
              };
              if (cif == "else"){
                (function(link){
                  anchor.onclick= function(){
                    line.removeChild(div);
                    qif.action(next,link);
                  }
                }(link))
              }
            }
            anchor.href = "javascript:;"
            anchor.removeAttribute("class");
            anchor.classList.add("shadow-text","no-decoration",qif.style.choiceLinkColor,qif.style.choiceLinkHoverColor,"move","fadeIn");
            div.appendChild(anchor)
            anchor.insertAdjacentHTML("beforebegin","<hr>");
            anchor.insertAdjacentHTML("afterend","<hr>");
            line.appendChild(div)
          }
          //STORE DATA
          else if (element.store){
            var command,storage;
            for (var store of element.store){
              for (var value in store){
                if(value == "set" || value == "add" || value == "take"){ command = value; storage = store[value]; continue}
                if(command == "set"){
                  qif[storage][value] = {};
                  for(var storeItem in store[value]){
                    //qif[storage][value] = store[value];
                    qif[storage][value][storeItem] = store[value][storeItem];
                  }
                  if(store[value].value && storage == "items") qi.add.snack("&triplus; OBJETO OBTENIDO &triplus;<br>" + value,qif.style.storedSnackColor);
                  console.log("= Stored " + storage + " " + value + " => " + qif[storage][value].value)
                  if(value == "hp") qif.data[value].max = store[value].value;
                };
                if(command == "add"){
                  for(var storeItem in store[value]){
                    qif[storage][value][storeItem] += store[value][storeItem];
                  }
                  console.log("+ Added " + storage + " " + value + " => " + qif[storage][value].value)
                };
                if(command == "take"){
                  if(store[value] == 0){
                    break
                  }
                  else{
                    for(var storeItem in store[value]){
                      qif[storage][value][storeItem] -= store[value][storeItem];
                    }
                  }
                  console.log("- Taken " + storage + " " + value + " => " + qif[storage][value].value)
                };
              }
            }
          }
          //CONDITIONS
          else if (element.if) {
            var key = element.if, condition=false,conditionLink = false;
            for (var value in key){
              if (condition){
                if (value == "link"){
                  var source = key.source ? key.source : path;
                  qif.action(source, key[value]);
                  conditionLink = true;
                  break;
                };
                if (value == "txt"){
                  var txt = document.createElement("p");
                  txt.innerHTML = key[value];
                  txt.classList.add("move","fadeIn");
                  line.appendChild(txt);
                  break;
                };
                if (value =="achieve"){
                  var achievement = key[value];
                  qif.achievements.push(achievement);
                  qi.add.snack("&xdtri; Logro obtenido &xdtri;<br>" + achievement.label,qif.style.achievementSnackColor);
                  //console.log(qif.achievements[qif.achievements.length-1]);
                  break;
                }
              }
              else if (qif.data[value] != undefined && qif.data[value].value == key[value])
                { condition = true ;console.log(qif.data[value])}
              else if (qif.items[value] != undefined && qif.items[value].value == key[value])
                {condition = true}
            };
            if (conditionLink){ break };
          }
          //ACHIEVEMENT
          else if (element.achieve){
            var achievement = element.achieve;
            qif.achievements.push(achievement);
            qi.add.snack("&xdtri; LOGRO OBTENIDO &xdtri;<br>" + achievement.label,qif.style.achievementSnackColor);
            //console.log(qif.achievements[qif.achievements.length-1])
          } 
          //CONTINUE
          else if (element.continue){
            var link = element.continue.link, next = element.continue.source ? element.continue.source : path;
            qif.action(next,link)
          }
          //CLEAR SCREEN
          else if (element.clear){
            line.innerHTML = "";
            qi.set.scrollTo(0,100);
          }
          else if (element.end){
          console.log("-------------------\nEND")
          var print = document.createElement("a"),
          achievements  = document.createElement("ul");
          achievements.classList.add("ul","border","margin");
          line.insertAdjacentHTML("beforeend","<hr><header class='center'><h4>"+element.end+"</h4></header>");
          line.insertAdjacentHTML("beforeend","<p>Tiempo total: " + qif.timer.hours + " horas y " + qif.timer.current +" minutos</p>" );
          if(qif.achievements.length > 0){
            line.insertAdjacentHTML("beforeend","<p>Logro(s) obtenido(s): "+qif.achievements.length+"</p>");
            for (var achieved of qif.achievements){
              var li = document.createElement("li");
              li.innerHTML = achieved.label;
              li.classList.add("center-block");
              li.width = "250px";
              achievements.appendChild(li);
              line.appendChild(achievements);
            }
          }
          if(qif.checkpoint.id){
            var check = document.createElement("button");
            check.classList.add("btn","blue");
            check.innerText = "Reintentar";
            console.log(qif.data)
            check.onclick = function(){
              qif.data = {};qif.items = {};qif.achievements = [];
              for(var datas in qif.checkpoint.data){
                qif.data[datas] = qif.checkpoint.data[datas];
              }
              for(var items in qif.checkpoint.items){
                qif.items[items] = qif.checkpoint.items[items]
              }
              for(var amnt of qif.checkpoint.achievements){
                qif.achievements[amnt] = qif.checkpoint.achievements[amnt];
              }
              qif.achievements = qif.checkpoint.achievements;
              qif.action(qif.checkpoint.source,qif.checkpoint.id);
              line.innerHTML = "";
              qi.set.scrollTo(0,100);
            }
            line.appendChild(check);
          }
          print.href = "javascript:void(0)"
          print.classList.add("btn","red");
          print.innerHTML = "Imprimir";
          print.classList.add("no-print");
          print.onclick = function(){window.print()};
          line.appendChild(print);
          line.insertAdjacentHTML("beforeend","<hr>")
       }
        }
      }
      /*else if (found)
      {
        qi.show.snack("El ID:<br>"+id+"<br>no existe",qif.style.errorSnackColor)
      }
      */
    }

  })
}
