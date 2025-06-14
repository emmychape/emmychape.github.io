document.addEventListener("DOMContentLoaded", () => {
  const archiveGrid = document.getElementById("archiveGrid");
  const modal = document.getElementById("modal");
  const container = document.getElementById("modalSvgContainer");
  const close = document.getElementById("closeModal");
  const exportBtn = document.getElementById("exportModalBtn");
  const delBtn = document.getElementById("deleteModeBtn");

  let deleteMode = false;
  const comps = JSON.parse(localStorage.getItem("compositions")||"[]");

  if(comps.length===0){
    archiveGrid.innerHTML="<p style='text-align:center'>Aucune composition</p>";
    return;
  }

  comps.forEach((c,i)=>{
    const div = document.createElement("div");
    div.className="grid-item";
    const svgDoc = new DOMParser().parseFromString(c.svg,"image/svg+xml").documentElement;
    if(!svgDoc.getAttribute("viewBox")) svgDoc.setAttribute("viewBox", `0 0 ${svgDoc.getAttribute("width")||1000} ${svgDoc.getAttribute("height")||1000}`);
    svgDoc.setAttribute("width","300");
    svgDoc.setAttribute("height","300");

    const blob = new Blob([new XMLSerializer().serializeToString(svgDoc)],{type:"image/svg+xml"});
    const img = new Image();
    img.onload = ()=>{
      const canvas=document.createElement("canvas");
      canvas.width=150;canvas.height=150;
      const ctx=canvas.getContext("2d");
      ctx.fillStyle="#fff";ctx.fillRect(0,0,150,150);
      ctx.drawImage(img,0,0,150,150);
      const preview=new Image();
      preview.src=canvas.toDataURL();
      preview.style.width="100%";
      preview.style.height="100%";
      div.appendChild(preview);
    };
    img.src = URL.createObjectURL(blob);

    div.addEventListener("click", ()=>{
      if(deleteMode){
        if(confirm("Supprimer cette composition ?")){
          comps.splice(i,1);
          localStorage.setItem("compositions", JSON.stringify(comps));
          location.reload();
        }
        return;
      }
      container.innerHTML = c.svg;
      const svgE = container.querySelector("svg");
      if(svgE){
        if(!svgE.getAttribute("viewBox")) svgE.setAttribute("viewBox", `0 0 ${svgE.getAttribute("width")||1000} ${svgE.getAttribute("height")||1000}`);
        svgE.removeAttribute("width");svgE.removeAttribute("height");
        svgE.setAttribute("preserveAspectRatio","xMidYMid meet");
        svgE.style.width="100%";svgE.style.height="100%";
        svgE.style.maxWidth="100%";svgE.style.maxHeight="100%";
        svgE.style.display="block";svgE.style.margin="auto";
      }
      modal.classList.remove("hidden");
      exportBtn.onclick = ()=>{
        const blob2 = new Blob([c.svg],{type:"image/svg+xml"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob2);
        a.download = `composition-${i+1}.svg`;
        a.click();
      };
    });

    archiveGrid.appendChild(div);
  });

  close.onclick = ()=>{
    modal.classList.add("hidden");
    container.innerHTML="";
  };
  delBtn.onclick = ()=> {
    deleteMode = !deleteMode;
    document.body.classList.toggle("delete-mode", deleteMode);
  };
});
