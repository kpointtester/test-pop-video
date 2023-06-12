var cdn_url = '@CDN_URL@';
var protocol = 'https';
var headElement = document.head;
var modalContainer = document.createElement('div');

var addModalStyle = function() {
  var cssElement = "<style>.kpoint-modal{display:none;align-items:center;justify-content:center;position:fixed;z-index:9999;left:0;top:0;width:100%;height:100%;background-color:rgba(0,0,0,.5)}.kpoint-modal-header{padding:0}.kpoint-modal-dialog{display:flex;align-items:center;justify-content:center;height:100%;width:100%}.kpoint-modal-body{padding:0}.kpoint-modal-content{border-radius:5px;padding:0;width:100%;max-width:600px;position:relative;overflow-y:auto}.close{position:absolute;top:10px;right:20px;font-size:30px;font-weight:bold;z-index:999;color:#fff;cursor:pointer}</style>";
  headElement.insertAdjacentHTML("beforeend", cssElement);
};

var getPlayerScript = function (hostname, samesite) {
  if (samesite && samesite !== "undefined") {
    return protocol + "://" + hostname + "/assets/orca/media/embed/videofront-vega.js";
  }
  return protocol + ":" + cdn_url + "/orca/media/embed/videofront-vega.js";
};

var appendPlayerScript = function(hostname, samesite){
  var playerScript = document.createElement("script");
	playerScript.src = getPlayerScript(hostname, samesite);
	playerScript.async = true;
	headElement.appendChild(playerScript);
};

var getModalHTML = function (hostname, videoid, playername, videoparams, samesite) {
  var modalHTML = 
  '<div class="kpoint-modal fade" id="' + playername + '" tabindex="-1" role="dialog" aria-labelledby="'+ playername +'Title" aria-hidden="true" >' +
    '<div class="kpoint-modal-dialog kpoint-modal-dialog-centered" role="document">' +
      '<div class="kpoint-modal-content">' +
        '<div class="kpoint-modal-header">' +
          '<span class="close" id="closeModal" data-target-modal="' + playername + '">&times;</span>' + 
        '</div>' +
        '<div class="kpoint-modal-body">' +
          '<div data-video-host="' + hostname + '" data-kvideo-id="' + videoid + '" data-video-params=\'' + JSON.stringify(videoparams) + '\' data-samesite="' + samesite + '" data-player="' + playername + '" style="width:100%"></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
  return modalHTML;
};


function createPlayerModal() {
  var embedDivs = document.querySelectorAll("[data-vx-host]");
  var hostName = embedDivs && embedDivs[0] && embedDivs[0].dataset && embedDivs[0].dataset.vxHost ? embedDivs[0].dataset.vxHost : "";
  var samesite = embedDivs && embedDivs[0] && embedDivs[0].dataset && embedDivs[0].dataset.vxSamesite ? embedDivs[0].dataset.vxSamesite : false;
  Array.prototype.forEach.call(embedDivs, function(container) {
    try {
      var parentDiv = container.parentElement;
      var videoId = container.dataset.vxVideoid;
      var playerName = container.dataset.vxPlayerref;
      var videoParams = container.dataset.vxParams ? JSON.parse(container.dataset.vxParams) : {};
      var modalDiv = getModalHTML(hostName, videoId, playerName, videoParams, samesite);
      var modalContainer = document.createElement('div');
      
	    modalContainer.innerHTML = modalDiv;
      parentDiv.appendChild(modalContainer.firstChild);
      
	    var closeModalBtn = parentDiv.querySelector('#closeModal');

      container.addEventListener('click', function(event) {
        var playerReference = event.target.dataset.vxPlayerref;
        var kpointModal = document.getElementById(playerReference);
        window[playerReference].playVideo();
        kpointModal.style.display = 'flex';
      });
      
      closeModalBtn.addEventListener('click', function(event) {
        var playerReference = event.target.dataset.targetModal;
        var kpointModal = document.getElementById(playerReference);
        window[playerReference].pauseVideo();
        kpointModal.style.display = 'none';
      });
    } catch(e) {
      console.log("Unable to create modal error:", e);
    }
  });
  if (hostName && typeof hostName === 'string' && hostName.trim() !== '') {
    appendPlayerScript(hostName, samesite);
  }
};

function initializeModal() {
  addModalStyle();
  createPlayerModal();
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initializeModal();
} else {
  document.addEventListener("DOMContentLoaded", function(event) {
    initializeModal();
  });
}
