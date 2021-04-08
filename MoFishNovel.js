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

    document.onkeydown = function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        var novelText = document.getElementById('novelText');
        if (e && e.keyCode == 17) { // 按Ctrl键
            // 防止出现多个组件
            if(document.getElementById("readFile")!==null){
                return;
            }

            var csdn = document.getElementById("csdn-toolbar");
            var input = document.createElement('input');
            input.setAttribute('id','readFile');
            input.setAttribute('type','file');
            csdn.appendChild(input);

            var content_views = document.getElementById('content_views');
            var centerNum=content_views.childNodes.length/2;
            var center=content_views.childNodes[Math.floor(centerNum)];
            var p = document.createElement('p');
            p.setAttribute('id','novelText');
            p.innerHTML="";
            center.appendChild(p);

            document.getElementById('readFile').addEventListener('change',function selectedFileChanged(){
                const reader=new FileReader();
                reader.onload=function fileReadCompleted(){
                    strArray=fixedLengthFormatString(reader.result,100);
                };
                reader.readAsText(this.files[0]);
            });
        }
        if (e && e.keyCode == 37) { // 按左键
            if(currentPage>0){
                novelText.innerHTML=strArray[--currentPage];
            }
        }
        if (e && e.keyCode == 39) { // 按右键
            if(currentPage<strArray.length){
                novelText.innerHTML=strArray[++currentPage];
            }
        }
        if (e && e.keyCode == 107) { // 按+键
            var page=prompt("页数：","");
            if (page!=null && page!=""){
                if(parseInt(page)<strArray.length){
                    novelText.innerHTML=strArray[++page];
                    currentPage=page;
                }else{
                    alert("请重新输入");
                }
            }
        }
    };

})();
