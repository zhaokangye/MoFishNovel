// ==UserScript==
// @name         MoFishNovel
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to read novel without being noticed
// @author       Kang
// @match        https://blog.csdn.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var csdn = document.getElementById('csdn-toolbar');
    var input = document.createElement('input');
    input.setAttribute('id','readFile');
    input.setAttribute('type','file');
    csdn.appendChild(input);

    var content_views = document.getElementById('content_views');
    var p = document.createElement('p');
    p.setAttribute('id','novelText');
    p.innerHTML="";
    content_views.appendChild(p);

    var strArray=[];
    var currentPage=0;

    function fixedLengthFormatString(str,num){
        if(str == null || str == undefined) return null;
        if(!(/^[0-9]*[1-9][0-9]*$/.test(num))) return null;
        var array = new Array();
        var len = str.length;
        for(var i=0;i<(len/num);i++){
            if((i+1)*num > len){
                array.push(str.substring(i*num,len));
            }else{
                array.push(str.substring(i*num,(i+1)*num));
            }
        }
        return array;
    };

    document.getElementById('readFile').addEventListener('change',function selectedFileChanged(){
        const reader=new FileReader();
        reader.onload=function fileReadCompleted(){
            strArray=fixedLengthFormatString(reader.result,100);
        };
        reader.readAsText(this.files[0]);
    });

    document.onkeydown = function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        var novelText = document.getElementById('novelText');
        if (e && e.keyCode == 37) { // 按左键
            novelText.innerHTML=strArray[--currentPage];
        }
        if (e && e.keyCode == 39) { // 按右键
            novelText.innerHTML=strArray[++currentPage];
        }
    };
})();
