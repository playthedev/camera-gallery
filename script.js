let video=document.querySelector('video')
let recorBtn=document.querySelector('.recorder-btn-cont');
let recorButton=recorBtn.querySelector('.recorder-btn');
let captureBtncont=document.querySelector('.capture-btn-cont');
let captureBtn=document.querySelector('.capture-btn');
let timer=document.querySelector('.timer');
let constraints={
    audio:true,
    video:true
}
let transparentColor='transparent';
let recorder;
let flag=false;
let flagcap=false;
let chunk=[];   
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject=stream;  
    recorder=new MediaRecorder(stream);
    recorder.addEventListener('start',(e)=>{                      
        recorButton.classList.add('scale-record')
        // console.log('start')
        startTimer()
        chunk=[];

    })
    recorder.addEventListener('dataavailable',(e)=>{
        console.log('data available')
        chunk.push(e.data);
    })
    recorder.addEventListener('stop',(e)=>{
        console.log(' stop')
        recorButton.classList.remove('scale-record')
        timeClear();
        let blob=new Blob(chunk,{type:'video/mp4'});
        // let videoURL=URL.createObjectURL(blob)
        // let a=document.createElement('a');
        // a.href=videoURL;
        // a.download='stream.mp4';
        // a.click();
       
        if(db){
            
            let videoId=shortid();
            let transactions=db.transaction('video','readwrite');
            let videoStore=transactions.objectStore('video');
            let videoEntry={
                id:`vid-${videoId}`,
                blobData:blob
            }
            // videoStore.add(videoEntry);  
            videoStore.add(videoEntry)
        }
    })
})
recorBtn.addEventListener('click',(e)=>{
    flag=!flag;
    if(!flag){
        console.log(false)
        recorder.stop();
        return;
    }
     console.log(true)

    recorder.start();
})

captureBtncont.addEventListener('click',(e)=>{
  console.log('capture');
  
  captureBtn.classList.add('scale-capture')
  let canvas=document.createElement('canvas');
  canvas.height=video.videoHeight;
  canvas.width=video.videoWidth;

  let tool=canvas.getContext('2d');
  
  tool.drawImage(video,0,0,canvas.width,canvas.height);
  tool.fillStyle=transparentColor;
  tool.fillRect(0,0,canvas.width,canvas.height);
  let imageURL=canvas.toDataURL()
  if(db){
    let imageId=shortid();
    let transactions=db.transaction('image','readwrite');
    let imageStore=transactions.objectStore('image');
    let imageEntry={
        id:`img-${imageId}`,
        URL:imageURL
    }
    imageStore.add(imageEntry);
}setTimeout(()=>{
    captureBtn.classList.remove('scale-capture');
},500)

})
let  time
let count=0;
function startTimer(){
    timer.style.display='block';
    count=0;
    function displayTimer(){
       let hour=Number.parseInt(count/3600);
       count=count%3600;

       let min=Number.parseInt(count/60);
       count=count%60;

       let sec=count;
       
       hour=hour<10?`0${hour}`:hour;
       min=min<10?`0${min}`:min;
       sec=sec<10?`0${sec}`:sec;
       timer.innerText=`${hour}:${min}:${sec}`
       count++;
    }
     time=setInterval(displayTimer,1000);
}
function  timeClear(){
   
    clearInterval(time);
    timer.innerText="00:00:00"
     timer.style.display='none';
}
let filterLayer=document.querySelector('.filter-layer');
let allfilters=document.querySelectorAll('.filter');
allfilters.forEach((colorElem)=>{
    colorElem.addEventListener('click',(e)=>{
       transparentColor= getComputedStyle(colorElem).getPropertyValue('background-color');
     
       filterLayer.style.backgroundColor=transparentColor;
    })
})
