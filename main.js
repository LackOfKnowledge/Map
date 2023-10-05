import "./style.css";

const map = L.map("map").setView([49.8841, 19.47467], 14);
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const markersGroup = L.markerClusterGroup();

class Pointer {
  constructor(title) {
    this.title = title;
    this.render();
  }

  markerEl = null;
  listEl = null;

  render = () => {
    const list = document.querySelector("ul");
    const point = document.createElement("li");
    point.innerHTML =
      "<li><label>" + this.title + "</label><button>Usuń</button></li>";
    const trigger = point.querySelector("label");
    trigger.addEventListener("click", this.addMarker);
    const deletePoint = point.querySelector("button");
    deletePoint.addEventListener("click", this.removePoint);
    list.append(point);
    this.listEl = point;
  };

  addMarker = () => {
    if (this.markerEl) {
      alert(
        "Nie możesz umieścić dwóch markerów przypisanych do jednego punktu."
      );
    } else {
      document.body.style.cursor = "crosshair";
      document.getElementById("map").classList.toggle("leaflet-grab");
      const that = this;
      map.on("click", (e) => {
        const coord = e.latlng;
        that.markerEl = new L.marker([coord.lat, coord.lng]);
        markersGroup.addLayer(this.markerEl);
        map.addLayer(markersGroup);
        map.off("click");
        document.body.style.cursor = "auto";
        document.getElementById("map").classList.toggle("leaflet-grab");
        this.listEl.classList.add("active");
        this.markerEl.on("click", (e) => {
          markersGroup.removeLayer(this.markerEl);
          this.markerEl = null;
          this.listEl.classList.toggle("active");
        });
      });
    }
  };
  removePoint = () => {
    markersGroup.removeLayer(this.markerEl);
    map.removeLayer(this.markerEl);
    this.markerEl = null;
    this.listEl.remove();
  };
}

const pointers = [];
for (let i = 1; i < 11; i++) {
  const point = new Pointer("punkt " + i);
  pointers.push(point);
}

const listHook = document.getElementById("pointList");
const inputName = document.getElementById("pointName");
const submitButton = document.getElementById("submit");

function addPoint() {
  const point = new Pointer(inputName.value);
}

submitButton.addEventListener("click", addPoint);
