window.ModuleLGPD=(function($){const cookieName='lgpd-accepted';const types=['box','bar']
var defaultSettings={title:'Armazenamento de Cookies',message:'Utilizamos cookies para oferecer melhor experiência, melhorar o desempenho, analisar como você interage em nosso site e personalizar conteúdo. Ao utilizar este site, você concorda com o uso de cookies.',position:'left',style:{container:{background:'#FFFFFF',color:'#000000',borderColor:'#e0e0e0',boxShadowColor:'#C0C0C0'},title:{color:'#000000',a:{color:'#000000'}},description:{color:'#000000',a:{color:'#000000'}},button:{text:'Aceito',color:'#FFFFFF',background:'#2e2d68',_hover:{color:'#FFFFFF',background:'#3a3985',}},},delay:3000,expireCookie:30}
function init(settings){if(!isCookieAccepted()){if(!settings)settings={};var settings=$.extend(true,defaultSettings,settings);var hash=uid();var templateHtml=setTemplate(settings,hash);var templateCss=setTemplateCSS(settings,hash);setTemplateOnBodyWithDelay(settings,templateCss+templateHtml,hash);}}
function setTemplate(settings,hash){var template=`
            <div class="lgpd-container lgpd-c-${hash}" style="display: none;">
                <div class="lgpd-title lgpd-t-${hash}">
                    ${settings.title}
                </div>
                <div class="lgpd-description lgpd-d-${hash}">
                    ${settings.message}
                </div>
                <button class="lgpd-button lgpd-b-${hash}">
                    ${settings.style.button.text}
                </button>
            </div>`;return template;}
function setTemplateCSS(settings,hash){var templateCss=`
        <style>
            .lgpd-c-${hash} {
                max-width: 350px;
                max-height: 350px;
                position: fixed;
                bottom: 5%;
                ${settings.position}: 2%;
                background: ${settings.style.container.background};
                color: ${settings.style.container.color};
                border-radius: 10px;
                box-shadow: 1px 1px 1px ${settings.style.container.boxShadowColor};
                padding: 1.3%;
                border: 1px solid ${settings.style.container.borderColor};
                line-height: 1.4;
                display: flex;
                flex-direction: column;
                z-index: 9999;
            }
            .lgpd-t-${hash} {
                font-size: 14px;
                font-weight: bold;
                color: ${settings.style.title.color};
            }
            .lgpd-t-${hash} a {
                text-decoration: underline;
                color: ${settings.style.title.a.color};
            }
            .lgpd-d-${hash} {
                font-size: 13px;
                margin: 4% auto;
                line-height: 1.4;
                color: ${settings.style.description.color};
            }
            .lgpd-d-${hash} a {
                text-decoration: underline;
                color: ${settings.style.description.a.color};
            }
            .lgpd-b-${hash} {
                display: inline-block;
                width: 30%;
                align-self: flex-end;
                font-size: 13px;
                font-weight: 600;
                padding: 3% 0;
                cursor: pointer;
                background: ${settings.style.button.background};
                border: none;
                border-radius: 3px;
                color: ${settings.style.button.color};
            }
            .lgpd-b-${hash}:hover {
                background: ${settings.style.button._hover.background};
                color: ${settings.style.button._hover.color};
            }
            @media only screen and (max-width: 600px) {
                .lgpd-c-${hash} {
                    max-width: inherit;
                    width: 100%;
                    bottom: 0;
                    padding: 5%;
                    ${settings.position}: 0;
                    border-radius: 0;
                }
                .lgpd-b-${hash} {
                    width: 100%;
                }
            }
        </style>`;return templateCss;}
function setTemplateEvents(settings,hash){var $buttonEl=$(`.lgpd-b-${hash}`);var $containerEl=$(`.lgpd-c-${hash}`);$buttonEl.click(function(){setCookie('lgpd-accepted',true,settings.expireCookie);$containerEl.fadeOut();})}
function setTemplateOnBodyWithDelay(settings,template,hash,callback){setTimeout(function(){$('body').append(template);$(`.lgpd-c-${hash}`).fadeIn();setTemplateEvents(settings,hash);},settings.delay);}
function uid(){var firstPart=(Math.random()*46656)|0;var secondPart=(Math.random()*46656)|0;firstPart=("000"+firstPart.toString(36)).slice(-3);secondPart=("000"+secondPart.toString(36)).slice(-3);return firstPart+secondPart;}
function setCookie(cname,cvalue,exdays){var d=new Date();d.setTime(d.getTime()+(exdays*24*60*60*1000));var expires="expires="+d.toUTCString();document.cookie=cname+"="+cvalue+";"+expires+";path=/";}
function getCookie(cname){var name=cname+"=";var decodedCookie=decodeURIComponent(document.cookie);var ca=decodedCookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' '){c=c.substring(1);}
if(c.indexOf(name)==0){return c.substring(name.length,c.length);}}
return "";}
function isCookieAccepted(){var cookieAccepted=getCookie(cookieName);return cookieAccepted?true:false;}
return{init}})(jQuery);