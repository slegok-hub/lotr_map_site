import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    deleteDoc, 
    doc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOln3x5e0I7nybrzl72dsGFHAMOp2N_DU",
  authDomain: "map-markers-7984c.firebaseapp.com",
  databaseURL: "https://map-markers-7984c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "map-markers-7984c",
  storageBucket: "map-markers-7984c.firebasestorage.app",
  messagingSenderId: "241210178546",
  appId: "1:241210178546:web:42c49819e4f07eb461896b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mapImage = document.getElementById('map-image');
const markersLayer = document.getElementById('markers-layer');
const colorPicker = document.getElementById('colorPicker');
const shapePicker = document.getElementById('shapePicker');

function renderMarker(id, xPercent, yPercent, color, shape) {
    const marker = document.createElement('div');
    marker.classList.add('marker', shape);
    marker.style.left = `${xPercent}%`;
    marker.style.top = `${yPercent}%`;
    marker.style.backgroundColor = color;
    marker.dataset.id = id;

    marker.addEventListener('contextmenu', async (e) => {
        e.preventDefault();
        if (confirm("Удалить эту метку?")) {
            try {
                await deleteDoc(doc(db, "markers", id));
            } catch (error) {
                console.error("Ошибка при удалении: ", error);
            }
        }
    });

    markersLayer.appendChild(marker);
}

mapImage.addEventListener('click', async (e) => {
    const rect = mapImage.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    const selectedColor = colorPicker.value;
    const selectedShape = shapePicker.value;

    try {
        await addDoc(collection(db, "markers"), {
            x: xPercent,
            y: yPercent,
            color: selectedColor,
            shape: selectedShape,
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Ошибка при сохранении метки: ", error);
    }
});

onSnapshot(collection(db, "markers"), (snapshot) => {
    markersLayer.innerHTML = '';
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        renderMarker(docSnap.id, data.x, data.y, data.color, data.shape);
    });
});