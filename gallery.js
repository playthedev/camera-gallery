setTimeout(()=>{
    let gallery=document.querySelector('.gallery-cont');
  
    if(db){
        let videotTransaction=db.transaction('video','readonly');
        let store=videotTransaction.objectStore('video');
        let videoRequest=store.getAll();
        
        videoRequest.onsuccess=(e)=>{
           let videoResult=videoRequest.result;
           
           
           videoResult.forEach((videoObj)=>{
             let mediaElem=document.createElement('div');
             mediaElem.setAttribute('class','media-cont');
             mediaElem.setAttribute('id',videoObj.id);
             let url=URL.createObjectURL(videoObj.blobData);
             mediaElem.innerHTML=`<div class="media">
               <video autoplay loop src="${url}"></video>
             </div>
             <div class="dwld action-btn">Download</div>
             <div class="delete action-btn">delete</div>
             `;
             gallery.appendChild(mediaElem);

             let deleteBtn=mediaElem.querySelector('.delete');
             let dwldBtn=mediaElem.querySelector('.dwld');
             deleteBtn.addEventListener('click',deleteListener);
             dwldBtn.addEventListener('click',dwldListener);
              
           })
        }
       }

       if(db){
        let imageTransaction=db.transaction('image','readonly');
        let store=imageTransaction.objectStore('image');
        let imageRequest=store.getAll();
        
        imageRequest.onsuccess=(e)=>{
           let imageResult=imageRequest.result;
           
           
           imageResult.forEach((imageObj)=>{
             let mediaElem=document.createElement('div');
             mediaElem.setAttribute('class','media-cont');
             mediaElem.setAttribute('id',imageObj.id);
             let url=imageObj.URL;
             mediaElem.innerHTML=`<div class="media">
               <image src="${url}"/>
             </div>
             <div class="dwld action-btn">Download</div>
             <div class="delete action-btn">delete</div>
             `;
             gallery.appendChild(mediaElem);

            let deleteBtn=mediaElem.querySelector('.delete');
            let dwldBtn=mediaElem.querySelector('.dwld');
            deleteBtn.addEventListener('click',deleteListener);
            dwldBtn.addEventListener('click',dwldListener);
           })
        }
       }
},100);

function deleteListener(e){
   let id=e.target.parentElement.getAttribute('id');
   if(id.slice(0,3)=='img'){
    let imageTransaction=db.transaction('image','readwrite');
        let store=imageTransaction.objectStore('image');
        store.delete(id);
        e.target.parentElement.remove();
   }else{
    let videoTransaction=db.transaction('video','readwrite');
        let store=videoTransaction.objectStore('video');
        store.delete(id);
        e.target.parentElement.remove();
   }
}

function dwldListener(e){
    let id=e.target.parentElement.getAttribute('id');
   if(id.slice(0,3)=='img'){
    let imageTransaction=db.transaction('image','readwrite');
        let store=imageTransaction.objectStore('image');
        let imgRequest=store.get(id);
        imgRequest.onsuccess=(e)=>{
            let imgResult=imgRequest.result;
            let imgURL=imgResult.URL;
            let a=document.createElement('a');
            a.href=imgURL;
            a.download='image.jpg';
            a.click(); 
        }
   }else{
    let videoTransaction=db.transaction('video','readwrite');
        let store=videoTransaction.objectStore('video');
        let vidReq=store.get(id);
        vidReq.onsuccess=(e)=>{
            let vidResult=vidReq.result;
           
            let videoURL=URL.createObjectURL(vidResult.blobData)
            let a=document.createElement('a');
            a.href=videoURL;
            a.download='stream.mp4';
            a.click(); 
        }
   }
 
}


