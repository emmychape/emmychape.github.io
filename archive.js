document.addEventListener("DOMContentLoaded", () => {
  const archiveGrid = document.getElementById("archiveGrid");
  const modal = document.getElementById("modal");
  const svgContainer = document.getElementById("modalSvgContainer");
  const closeBtn = document.getElementById("closeModal");
  const exportBtn = document.getElementById("exportModalBtn");
  const deleteBtn = document.getElementById("deleteModeBtn");
  
  let deleteMode = false;
  const compositions = JSON.parse(localStorage.getItem("compositions") || "[]");

  if (compositions.length === 0) {
    archiveGrid.innerHTML = "<p style='text-align:center'>Aucune composition</p>";
    return;
  }

  compositions.forEach((comp, i) => {
    const div = document.createElement("div");
    div.className = "grid-item";
    // create preview...
    div.addEventListener("click", () => {
      if (deleteMode) {
        if (confirm("Supprimer ?")) {
          compositions.splice(i, 1);
          localStorage.setItem("compositions", JSON.stringify(compositions));
          location.reload();
        }
        return;
      }

      svgContainer.innerHTML = comp.svg;
      const svgEl = svgContainer.querySelector("svg");
      if (svgEl) {
        if (!svgEl.getAttribute("viewBox")) {
          const w = svgEl.getAttribute("width") || 1000;
          const h = svgEl.getAttribute("height") || 1000;
          svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);
        }
        svgEl.removeAttribute("width");
        svgEl.removeAttribute("height");
        svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svgEl.style.width = "100%";
        svgEl.style.height = "100%";
        svgEl.style.display = "block";
        svgEl.style.margin = "auto";
      }

      modal.classList.remove("hidden");
      exportBtn.onclick = () => {
        const blob = new Blob([comp.svg], { type: 'image/svg+xml' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `composition-${i+1}.svg`;
        link.click();
      };
    });

    archiveGrid.appendChild(div);
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    svgContainer.innerHTML = '';
  });

  deleteBtn.addEventListener("click", () => {
    deleteMode = !deleteMode;
    document.body.classList.toggle("delete-mode", deleteMode);
  });
});
