document.addEventListener("DOMContentLoaded", () => {
  const archiveGrid = document.getElementById("archiveGrid");
  const modal = document.getElementById("modal");
  const modalSvgContainer = document.getElementById("modalSvgContainer");
  const closeModal = document.getElementById("closeModal");
  const exportModalBtn = document.getElementById("exportModalBtn");
  const deleteBtn = document.getElementById("deleteModeBtn");

  let deleteMode = false;
  let compositions = JSON.parse(localStorage.getItem("compositions") || "[]");

  if (!compositions.length) {
    archiveGrid.innerHTML = "<p style='text-align:center'>Aucune composition sauvegardée</p>";
    return;
  }

  compositions.forEach((comp, index) => {
    const div = document.createElement("div");
    div.className = "grid-item";

    // Crée un aperçu image PNG à partir du SVG
    const svgDoc = new DOMParser().parseFromString(comp.svg, "image/svg+xml").documentElement;
    const cloneSvg = svgDoc.cloneNode(true);

    if (!cloneSvg.getAttribute("viewBox")) {
      const width = cloneSvg.getAttribute("width") || "1000";
      const height = cloneSvg.getAttribute("height") || "1000";
      cloneSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }

    cloneSvg.setAttribute("width", "300");
    cloneSvg.setAttribute("height", "300");

    const data = new XMLSerializer().serializeToString(cloneSvg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const preview = new Image();
      preview.src = canvas.toDataURL("image/png");
      preview.style.width = "100%";
      preview.style.height = "100%";
      preview.alt = "Aperçu";
      div.appendChild(preview);
    };
    img.src = url;

    div.addEventListener("click", () => {
      if (deleteMode) {
        if (confirm("Supprimer cette composition ?")) {
          compositions.splice(index, 1);
          localStorage.setItem("compositions", JSON.stringify(compositions));
          location.reload();
        }
        return;
      }

      modalSvgContainer.innerHTML = comp.svg;
      const svgEl = modalSvgContainer.querySelector("svg");

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
        svgEl.style.maxWidth = "100%";
        svgEl.style.maxHeight = "100%";
        svgEl.style.display = "block";
        svgEl.style.margin = "auto";
      }

      modal.classList.remove("hidden");

      exportModalBtn.onclick = () => {
        const blob2 = new Blob([comp.svg], { type: "image/svg+xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob2);
        link.download = `composition-${index + 1}.svg`;
        link.click();
      };
    });

    archiveGrid.appendChild(div);
  });

  closeModal.onclick = () => {
    modal.classList.add("hidden");
    modalSvgContainer.innerHTML = "";
  };

  deleteBtn.onclick = () => {
    deleteMode = !deleteMode;
    document.body.classList.toggle("delete-mode", deleteMode);
  };
});
