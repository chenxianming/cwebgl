(function(e){!function(r){typeof exports==e[0]&&typeof module==e[0]?r(require(e[1]),require(e[2])):typeof define==e[3]&&define[e[4]]?define([e[1],e[2]],r):r(CodeMirror)}(function(r){"use strict";function n(r,n,o,t,i){r[e[5]]?r[e[5]](n,i,{value:t,selectValueOnOpen:!0}):i(prompt(o,t))}function o(r){return r[e[6]](e[7])+e[8]+r[e[6]](e[9])+e[10]}function t(r,n){var o=Number(n);return/^[-+]/[e[11]](n)?r[e[13]]()[e[12]]+o:o-1}r[e[15]][e[14]]=function(r){var i=r[e[13]]();n(r,o(r),r[e[6]](e[7]),i[e[12]]+1+e[16]+i[e[17]],function(n){if(n){var o;if(o=/^\s*([\+\-]?\d+)\s*\:\s*(\d+)\s*$/[e[18]](n))r[e[19]](t(r,o[1]),Number(o[2]));else if(o=/^\s*([\+\-]?\d+(\.\d+)?)\%\s*/[e[18]](n)){var s=Math[e[20]](r[e[21]]()*Number(o[1])/100);/^[-+]/[e[11]](o[1])&&(s=i[e[12]]+s+1),r[e[19]](s-1,i[e[17]])}else(o=/^\s*\:?\s*([\+\-]?\d+)\s*/[e[18]](n))&&r[e[19]](t(r,o[1]),i[e[17]])}})},r[e[22]][e[23]][e[24]]=e[14]})}).call(this,["object","../../lib/codemirror","../dialog/dialog","function","amd","openDialog","phrase","Jump to line:",' <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">',"(Use line:column or scroll% syntax)","</span>","test","line","getCursor","jumpToLine","commands",":","ch","exec","setCursor","round","lineCount","keyMap","default","Alt-G"]);