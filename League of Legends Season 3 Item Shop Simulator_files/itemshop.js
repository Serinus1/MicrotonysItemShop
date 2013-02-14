
items = items.items;
items2 = new Array();
for (var i=0; i<items.length; i++) {
  items2[items[i].id] = items[i];
}
var updateBuildsDesc = function (itemid) {
  $('#descitemname').html('<span>'+strings['game_item_displayname_'+items2[itemid].name]+'</span>');
  $('#descitemtext').html(strings['game_item_description_'+items2[itemid].description]);
  $('#descitemgold').html(items2[itemid].specialRecipe? "Special" : items2[itemid].gold.total);
  $('#descitemiconimage').attr('src',images[itemid]);
  $('#rbuildsitems').empty();
  $('#rbuildsitems').removeClass('page1').removeClass('page2').removeClass('page3').addClass('page1');
  $('#rbuildsitems').attr('page',1).attr('maxpage',0);
  $('#rbuildsnext').addClass('disabled');
  if (items2[itemid].into) {
    var j=0;
    for (var i=0; i<items2[itemid].into.length; i++) {
      if ($.inArray(parseInt(items2[itemid].into[i]), maps[mapid])==-1) {
        $('#rbuildsitems').append('<div class=\"icon selable page'+(Math.floor(j/7)+1)+'\" itemid=\"'+items2[itemid].into[i]+'\"><div class=\"cover\"></div><img src=\"'+images[items2[itemid].into[i]]+'\"></div>');
        j++;
        $('#rbuildsitems .icon').click(function() {
          $('#tooltip').hide();
          viewItem($(this).attr('itemid'));
        });
      }
    }
    $('#rbuildsitems').attr('maxpage',Math.ceil(j/7));
    if (j>7) {
      $('#rbuildsnext').removeClass('disabled');
    } 
  }
  $('#rbuildsitems > div').mousemove(itemtooltip);
  $('#rbuildsitems > div').mouseout(function(){$('#tooltip').hide();});

  $('#rbuildsprev').addClass('disabled');
  $('#rdescription > div').show();
  if (showItem(itemid)) {
    $('#buy').removeClass('disabled');
  } else {
    $('#buy').addClass('disabled');
  }
}
var viewItem = function(itemid) {
  updateBuildsDesc(itemid);
  // build item tree
  $('#rrequirescanvas').empty();
  var svg = itemTree(itemid,0,items2[itemid].depth,0,264);
  //console.log(svg);
  $('#rrequirescanvassvg').replaceWith($('<svg id="rrequirescanvassvg" version="1.1" xmlns="http://www.w3.org/2000/svg">'+svg+'</svg>'));
  $('.requires').click(itemTreeClick);
  $('.requires').mousemove(itemtooltip);
  $('.requires').mouseout(function(){$('#tooltip').hide();});

};
var itemTreeClick = function() {
  $('.requires').removeClass('sel');
  $(this).addClass('sel');
  updateBuildsDesc($(this).attr('itemid'));
}
var itemTree = function(item,level,depth,left,right) {
  var it = items2[item];
  var e;
  if (depth==4) {
    e=$("<div class=\"requires requires4 buyable\" itemid=\""+it.id+"\"><div class=\"icon nonsel\"><div class=\"cover\"></div><img src=\""+images[it.id]+"\"></div><div class=\"itemgold\">"+(it.specialRecipe?"*":it.gold.total)+"</div></div>");
    e.css('left',(left+right-36)/2+'px').css('top',(level*39-11)+'px');
  } else if (depth==3) {
    e=$("<div class=\"requires requires3 buyable\" itemid=\""+it.id+"\"><div class=\"icon nonsel\"><div class=\"cover\"></div><img src=\""+images[it.id]+"\"></div><div class=\"itemgold\">"+(it.specialRecipe?"*":it.gold.total)+"</div></div>");
    e.css('left',(left+right-36)/2+'px').css('top',(level*52-6)+'px');
  } else {
    e=$("<div class=\"requires buyable\" itemid=\""+it.id+"\"><div class=\"icon nonsel\"><div class=\"cover\"></div><img src=\""+images[it.id]+"\"></div><div class=\"itemgold\">"+(it.specialRecipe?"*":it.gold.total)+"</div></div>");
    e.css('left',(left+right-36)/2+'px').css('top',level*70+4+'px');
  }
  if (level==0) {
    e.addClass('sel');
  }
  $('#rrequirescanvas').append(e);
  var s = "";
  if (!it.from && it.specialRecipe && it.specialRecipe!="1") {
    it.from = new Array(it.specialRecipe);
  }
  if (it.from) {
    var x = right-left;
    var y = x/it.from.length;
    var a = 0;
    var b = 0;
    var c = 0;
    
    if (depth==2 && level==0) {
      a=58; b=65.5; c=73; // depth 2 54->62->70
    } else if (depth==3 && level==0) {
      a=45; b=47.5; c=50; // depth 3 37.6->40->42
    } else if (depth==3 && level==1) {
      a=97; b=99.5; c=101.4;
    } else if (depth==4 && level==0) {
      a=34; b=35.5; c=37.2;
    } else if (depth==4 && level==1) {
      a=73; b=74.5; c=76.2;
    } else if (depth==4 && level==2) {
      a=112; b=113.5; c=115.2;
    }
    // vertical
    s += '<line x1="'+(right+left)/2+'" y1="'+a+'" x2="'+(right+left)/2+'" y2="'+b+'" style="stroke:rgb(220,220,220);stroke-width:1"/>'; 
    // horizonal
    s += '<line x1="'+(left+y/2)+'" y1="'+b+'" x2="'+(right-y/2)+'" y2="'+b+'" style="stroke:rgb(220,220,220);stroke-width:1"/>'; 
    for (var i=0; i<it.from.length; i++) {
      s += itemTree(it.from[i],level+1,depth,left+y*i,left+y*i+y);
      s += '<line x1="'+(left+y*i+y/2)+'" y1="'+b+'" x2="'+(left+y*i+y/2)+'" y2="'+c+'" style="stroke:rgb(220,220,220);stroke-width:1"/>'; 
    }
  }
  return s;
};
var nextPage = function() {
  if (parseInt($('#rbuildsitems').attr('maxpage'))>1 && parseInt($('#rbuildsitems').attr('page'))<parseInt($('#rbuildsitems').attr('maxpage'))) {
    $('#rbuildsitems').attr('page',parseInt($('#rbuildsitems').attr('page'))+1);
    $('#rbuildsitems').removeClass('page1').removeClass('page2').removeClass('page3').addClass('page'+parseInt($('#rbuildsitems').attr('page')));
    if ($('#rbuildsitems').attr('page')==$('#rbuildsitems').attr('maxpage')) {
      $('#rbuildsnext').addClass('disabled');
    }
    $('#rbuildsprev').removeClass('disabled');
  }
};
var prevPage = function() {
  if (parseInt($('#rbuildsitems').attr('maxpage'))>1 && 0+$('#rbuildsitems').attr('page')>1) {
    $('#rbuildsitems').attr('page',parseInt($('#rbuildsitems').attr('page'))-1);
    $('#rbuildsitems').removeClass('page1').removeClass('page2').removeClass('page3').addClass('page'+parseInt($('#rbuildsitems').attr('page')));
    if (parseInt($('#rbuildsitems').attr('page'))==1) {
      $('#rbuildsprev').addClass('disabled');
    }
    $('#rbuildsnext').removeClass('disabled');
  }
}

var filterMode = 'cat';
var updateCatSel = function(n) {
  $('#catall').removeClass('sel');
  $('.cat').removeClass('sel');
  $('.subcat').removeClass('sel');
  n.addClass('sel');
  filterMode = 'cat';
};

var showItem = function(itemid) {
  return items2[itemid].hideFromAll!=true && items2[itemid].specialRecipe!=1 && items2[itemid].inStore!=false && !items2[itemid].requiredChampion && ($.inArray(parseInt(itemid), maps[mapid])==-1);
}
$('.subcat').click(function() {
  $('#itemlist').empty(); // clear list
  for (var i=0; i<items.length; i++) {
    if ($.inArray($(this).attr('tag'),items[i].tags)>=0 && showItem(items[i].id)) {
      $('#itemlist').append("<div class=\"buyable\" itemid=\""+items[i].id+"\"><div class=\"icon nonsel\"><div class=\"cover\"></div><img src=\""+images[items[i].id]+"\"></div><div class=\"itemname\"><span>"+strings['game_item_displayname_'+items[i].id]+"</span></div><div class=\"itemgold\">"+items[i].gold.total+"</div></div>");
    }
  }
  updateCatSel($(this));
  $('#listwrap').scrollTop(0);
  $('#cats .box').removeClass('sel');
  $('#cats .box[tag='+$(this).attr('tag')+']').addClass('sel');
  updateBoxes();
  $('#itemlist > div').click(function() {
    viewItem($(this).attr('itemid'));
    $('#itemlist > div').removeClass('sel');
    $('#itemlist div[itemid='+$(this).attr('itemid')+']').addClass('sel');
  });
  $('#itemlist > div').mousemove(itemtooltip);
  $('#itemlist > div').mouseout(function(){$('#tooltip').hide();});
});
$('.cat').click(function() {
  $('#itemlist').empty(); // clear list
  for (var i=0; i<items.length; i++) {
    var found=false;
    var tags=$(this).attr('tags').split(',');
    for (var j=0; j<items[i].tags.length; j++) {
      if ($.inArray(items[i].tags[j], tags)>=0) found = true;
    }
    if (found && showItem(items[i].id)) {
      $('#itemlist').append("<div class=\"buyable\" itemid=\""+items[i].id+"\"><div class=\"icon nonsel\"><div class=\"cover\"></div><img src=\""+images[items[i].id]+"\"></div><div class=\"itemname\"><span>"+strings['game_item_displayname_'+items[i].id]+"</span></div><div class=\"itemgold\">"+items[i].gold.total+"</div></div>");
    }
  }
  updateCatSel($(this));
  $('#listwrap').scrollTop(0);
  $('#cats .box.sel').removeClass('sel');
  updateBoxes();
  $('#itemlist > div').click(function() {
    viewItem($(this).attr('itemid'));
    $('#itemlist > div').removeClass('sel');
    $('#itemlist div[itemid='+$(this).attr('itemid')+']').addClass('sel');
  });
  $('#itemlist > div').mousemove(itemtooltip);
  $('#itemlist > div').mouseout(function(){$('#tooltip').hide();});
});

var viewAll = function() {
  $('#itemlist').empty(); // clear list
  for (var i=0; i<items.length; i++) {
    if (showItem(items[i].id)) {
      $('#itemlist').append("<div class=\"buyable\" itemid=\""+items[i].id+"\"><div class=\"icon nonsel\"><div class=\"cover\"></div><img src=\""+images[items[i].id]+"\"></div><div class=\"itemname\"><span>"+strings['game_item_displayname_'+items[i].id]+"</span></div><div class=\"itemgold\">"+items[i].gold.total+"</div></div>");
    }
  }
  updateCatSel($('#catall'));
  $('#listwrap').scrollTop(0);
  $('#cats .box.sel').removeClass('sel');
  updateBoxes();
  $('#itemlist > div').click(function() {
    viewItem($(this).attr('itemid'));
    $('#itemlist > div').removeClass('sel');
    $('#itemlist div[itemid='+$(this).attr('itemid')+']').addClass('sel');
  });
  $('#itemlist > div').mousemove(itemtooltip);
  $('#itemlist > div').mouseout(function(){$('#tooltip').hide();});
};

$('#catall').click(viewAll);

var advFilter = function() {
  $('.cat').removeClass('sel');
  $('.subcat').removeClass('sel');
  $('#catall').removeClass('sel');
  var seled = 0;
  seled = $('#cats .box.sel'); 
  console.log(seled);
  $('#itemlist').empty();
  for (var i=0; i<items.length; i++) {
    if (showItem(items[i].id)) {
      var show = true;
      for (var j=0; j<seled.size(); j++) {
        if ($.inArray($(seled[j]).attr('tag'),items[i].tags)==-1) {
          show = false;
          break;
        }
      }
      if (show) {
        $('#itemlist').append("<div class=\"buyable\" itemid=\""+items[i].id+"\"><div class=\"icon nonsel\"><div class=\"cover\"></div><img src=\""+images[items[i].id]+"\"></div><div class=\"itemname\"><span>"+strings['game_item_displayname_'+items[i].id]+"</span></div><div class=\"itemgold\">"+items[i].gold.total+"</div></div>");
      }
    }
  }
  $('#itemlist > div').click(function() {
    viewItem($(this).attr('itemid'));
    $('#itemlist > div').removeClass('sel');
    $('#itemlist div[itemid='+$(this).attr('itemid')+']').addClass('sel');
    $('#searchresults').show();
  });
  $('#itemlist > div').mousemove(itemtooltip);
  $('#itemlist > div').mouseout(function(){$('#tooltip').hide();});
};
var updateBoxes = function() {
  $('#cats .box').addClass('disabled');
  $('#cats .subcat').removeClass('white');
  var seled = 0;
  seled = $('#cats .box.sel'); 
  for (var i=0; i<seled.size(); i++) {
    $('#cats .subcat[tag=\''+$(seled[i]).attr('tag')+'\']').addClass('white');
  }
  for (var i=$('#itemlist > div').first(); i && i.attr('itemid'); i=i.next()) {
    var tags = items2[i.attr('itemid')].tags;
    for (var j=0; j<tags.length; j++) {
      $('#cats .box[tag='+tags[j]+']').removeClass('disabled');
    }
  }
};
$('#cats .box').click(function () {
  if ($(this).hasClass('disabled')) return false;
  if (filterMode == 'cat') {
    $(this).addClass('sel');
    filterMode = 'adv';
    advFilter();
    updateBoxes();
  } else {
    $(this).toggleClass('sel');  
    //console.log('toggle');
    if ($('#cats .box.sel').size()) {
      advFilter();
      updateBoxes();
    } else {
      viewAll();
    }
  }
});

var searchResults = function() {
  var query = $('#searchtextbox').val().replace(/[\t\n]/g,'');
  //console.log(query);
  if (query.replace(/\s/g,'')=='') {
    $('#searchresults').hide();
    return ;
  }
  var parts = query.split(' ');
  $('#searchresultslist').empty();
  for (var i=0; i<items.length; i++) {
    if (showItem(items[i].id)) {
      var show = true;
      for (var j=0; j<parts.length; j++) {
        if (parts[j]=="") continue;
        if ((strings['game_item_displayname_'+items[i].id]+strings['game_item_colloquialism_'+items[i].id]).toLowerCase().indexOf(parts[j])==-1) {
          show = false;
          break;
        }
      }
      if (show) {
        $('#searchresultslist').append("<div class=\"buyable\" itemid=\""+items[i].id+"\"><div class=\"icon nonsel\"><div class=\"cover\"></div><img src=\""+images[items[i].id]+"\"></div><div class=\"itemname\"><span>"+strings['game_item_displayname_'+items[i].id]+"</span></div><div class=\"itemgold\">"+items[i].gold.total+"</div></div>");
      }
    }
  }
  $('#searchresults').show();
  $('#searchresultslist > div').click(function() {
    viewItem($(this).attr('itemid'));
    $('#searchresultslist > div').removeClass('sel');
    $('#searchresultslist div[itemid='+$(this).attr('itemid')+']').addClass('sel');
  });
  $('#searchresultslist > div').mousemove(itemtooltip);
  $('#searchresultslist > div').mouseout(function(){$('#tooltip').hide();});
};
var setRecommend = function(champ) {
  $('.recblock').empty();
  var blocks = recommend[champ][parseInt(mapid)];
  for (var i=0; i<blocks.length; i++) {
    for (var j=0; j<blocks[i].items.length; j++) {
      if (items2[blocks[i].items[j].id]) {
        $('.recblock[rectype='+blocks[i].type+']').append("<div class=\"buyable\" itemid=\""+blocks[i].items[j].id+"\"><div class=\"icon nonsel\"><div class=\"cover\"></div><img src=\""+images[blocks[i].items[j].id]+"\"></div><div class=\"itemname\"><span>"+strings['game_item_displayname_'+blocks[i].items[j].id]+"</span></div><div class=\"itemgold\">"+items2[blocks[i].items[j].id].gold.total+"</div><div class=\"itemcount\">"+(blocks[i].items[j].count>1?blocks[i].items[j].count:"")+"</div><span>"+strings['game_item_plaintext_'+blocks[i].items[j].id]+"</span></div>");
      } else {
        console.log(blocks[i].items[j].id);
      }
    }
  }
  $('.recblock > div').click(function() {
    viewItem($(this).attr('itemid'));
    $('.recblock > div').removeClass('sel');
    $(this).addClass('sel');
  });
  $('.recblock > div').mousemove(itemtooltip);
  $('.recblock > div').mouseout(function(){$('#tooltip').hide();});
  $('#reccontent').scrollTop(0);
};
var itemtooltip = function(e) {
  if ($('#tooltip').attr('itemid')!=$(this).attr('itemid')) {
    var it = items2[$(this).attr('itemid')];
    $('#tooltip').attr('itemid',$(this).attr('itemid'));
    $('#tooltip').attr('cat','');
    $('#tooltip').html("<div class=\"icon nonsel\"><div class=\"cover\"></div><img src=\""+images[it.id]+"\"></div><div class=\"itemname\"><span>"+strings['game_item_displayname_'+it.name]+"</span></div><div class=\"itemgold\">"+(it.specialRecipe?"Special":it.gold.total)+"</div><div class=\"tooltipdescription\">"+strings['game_item_description_'+it.description]+"</div>");
  }
  $('#tooltip').css('left', e.clientX+15);
  $('#tooltip').css('top', e.clientY);
  $('#tooltip').show();
};
var cattooltip = function(e) {
  if ($('#tooltip').attr('cat')!=$(this).attr('cat')) {
    $('#tooltip').attr('cat',$(this).attr('cat'));
    $('#tooltip').attr('itemid','');
    $('#tooltip').html("<div class=\"tooltipcategory\">"+strings['flash_itemShop_categories_tooltip_'+$(this).attr('tag')].replace('Header Category<br />','')+"</div>");
  }
  $('#tooltip').css('left', e.clientX+15);
  $('#tooltip').css('top', e.clientY);
  $('#tooltip').show();
};

var changeMap = function () {
  mapid = $(this).attr('mapid');
  $('.maps').removeClass('sel');
  $(this).addClass('sel');
  viewAll();
  $('#searchresults').hide();
  setRecommend($('#champselectbox option').filter(':selected').attr('champ'));
  document.cookie = "mapid="+mapid;
};
$('#r2icon').click(function() {
  $('#r2icon').removeClass('norm').addClass('sel');
  $('#r2list').removeClass('sel').addClass('norm');
  $('#itemlist').removeClass('namelist').addClass('iconlist');
  $('.recblock').removeClass('reclist');
  document.cookie = "r2=icon";
});
$('#r2list').click(function() {
  $('#r2list').removeClass('norm').addClass('sel');
  $('#r2icon').removeClass('sel').addClass('norm');
  $('#itemlist').removeClass('iconlist').addClass('namelist');
  $('.recblock').addClass('reclist');
  document.cookie = "r2=list";
});
$('#searchcancel').click(function() {
  $('#searchresults').hide();
  $('#searchtextbox').val('');
});
$('#rbuildsprev').click(prevPage);
$('#rbuildsnext').click(nextPage);
$('#searchtextbox').keyup(searchResults);
$('#searchtextbox').click(function() {
  if ($('#searchtextbox').val()) {
    searchResults();
  }
});
$('#searchtextbox').val('');
$('#main').click(function(event) {
  var t = $(event.target);
  if ((!t || !t.attr('id') || t.attr('id').indexOf('search')==-1) && (!t.parent() || !t.parent().attr('id') || t.parent().attr('id').indexOf('search')==-1) && (!t.parents('.buyable') || !t.parents('.buyable').parent().attr('id') || t.parents('.buyable').parent().attr('id').indexOf('search')==-1)) {
    $('#searchresults').hide();
  }
  event.stopPropagation();
});
$('#r1recommend').click(function() {
  $('#r1recommend').addClass("r1sel").removeClass("r1");
  $('#r1all').addClass("r1").removeClass("r1sel");
  $('#taball').hide();
  $('#tabrec').show();
});
$('#r1all').click(function() {
  $('#r1recommend').addClass("r1").removeClass("r1sel");
  $('#r1all').addClass("r1sel").removeClass("r1");
  $('#taball').show();
  $('#tabrec').hide();
});
$('#champselectbox').change(function() {
  setRecommend($('#champselectbox option').filter(':selected').attr('champ'));
  document.cookie = "champ="+$('#champselectbox option').filter(':selected').attr('champ');
});
var specials = ['2009','2050','3166','3175','3200'];
for (var i=0; i<specials.length; i++) {
  $('#specials').append('<div class=\"icon selable\" itemid=\"'+specials[i]+'\"><div class=\"cover\"></div><img src=\"'+images[specials[i]]+'\"></div>');
}
$('#specials > div').click(function() {
  viewItem($(this).attr('itemid'));
});
$('.subcat').mousemove(cattooltip);
$('.subcat').mouseout(function(){$('#tooltip').hide();});
$('.cat').mousemove(cattooltip);
$('.cat').mouseout(function(){$('#tooltip').hide();});
$('#catall').mousemove(cattooltip);
$('#catall').mouseout(function(){$('#tooltip').hide();});
$('.box').mousemove(cattooltip);
$('.box').mouseout(function(){$('#tooltip').hide();});
$('#specials > div').mousemove(itemtooltip);
$('#specials > div').mouseout(function(){$('#tooltip').hide();});

function getCookie(c_name) {
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}

// initialization
for (var i=0; i<champs.length; i++) {
  $('#champselectbox').append("<option champ=\""+champs[i]+"\">"+strings['game_character_displayname_'+champs[i]]+"</option>");
}
$('.maps').click(changeMap);
var mapid = '1';
if (getCookie('mapid')) {
  mapid = getCookie('mapid');
  $('#map'+mapid).trigger('click');
} else {
  $('#map1').trigger('click');
}
if (getCookie('champ')) {
  setRecommend(getCookie('champ'));
  $('#champselectbox').val(getCookie('champ'));
} else {
  setRecommend("Ahri");
  $('#champselectbox').val('Ahri');
}
if (getCookie('r2')) {
  $('#r2'+getCookie('r2')).trigger('click');
}
viewAll();

