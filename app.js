const API_URL = 'http://localhost:3000/api';

// Cargar los ejercicios al iniciar la página
document.addEventListener('DOMContentLoaded', cargarEjercicios);

// Agregar listeners a botones de "Agregar Ejercicio"
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dia = e.target.getAttribute('dia');
      abrirModalAgregar(dia);
    });
  });
});

async function cargarEjercicios() {
  try {
    const response = await fetch(`${API_URL}/dias`);
    const dias = await response.json();
    
    // Renderizar ejercicios por día
    dias.forEach(dia => {
      const diaId = dia.nombre.toLowerCase();
      const contenedorDia = document.getElementById(diaId);
      
      if (contenedorDia) {
        contenedorDia.innerHTML = '';
        
        dia.ejercicios.forEach(ejercicio => {
          const ejercicioHTML = crearEjercicioHTML(ejercicio, dia.nombre);
          contenedorDia.innerHTML += ejercicioHTML;
        });
      }
    });
  } catch (error) {
    console.error('Error al cargar los ejercicios:', error);
  }
}

function crearEjercicioHTML(ejercicio, dia) {
  return `
    <div class="ejercicio" id="ejercicio-${ejercicio.id}">
      <h3>${ejercicio.nombre}</h3>
      <p><strong>Grupo muscular:</strong> ${ejercicio.grupoMuscular}</p>
      <p><strong>Series:</strong> ${ejercicio.series}</p>
      <p><strong>Repeticiones:</strong> ${ejercicio.reps}</p>
      <p><strong>Peso:</strong> ${ejercicio.peso > 0 ? ejercicio.peso + ' kg' : 'Sin peso'}</p>
      <div class="acciones">
        <button class="btn-editar" onclick="abrirModalEditar(${ejercicio.id})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarEjercicio(${ejercicio.id})">Eliminar</button>
      </div>
    </div>
  `;
}

function abrirModalAgregar(dia) {
  console.log(`Agregar ejercicio al día: ${dia}`);
  // Aquí puedes agregar un modal o formulario
}

function abrirModalEditar(id) {
  console.log(`Editar ejercicio ${id}`);
  // Aquí puedes agregar un modal o formulario de edición
}

async function eliminarEjercicio(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este ejercicio?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/ejercicios/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      // Recargar ejercicios
      cargarEjercicios();
      alert('Ejercicio eliminado correctamente');
    } else {
      alert('Error al eliminar el ejercicio');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
  }
}
